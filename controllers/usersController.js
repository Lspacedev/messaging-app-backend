const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const io = require("../app");
const supabase = require("../config/supabase");
const { decode } = require("base64-arraybuffer");
const { v4: uuidv4 } = require("uuid");

//validation
const { body, validationResult } = require("express-validator");
const { empty } = require("@prisma/client/runtime/library");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 1600 })
    .withMessage(`Username ${lengthErr}`),
];

const validateMessage = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 1600 })
    .withMessage(`Text ${lengthErr}`),
];

async function allUsers(req, res) {
  //return all users
  try {
    const users = await prisma.user.findMany({
      include: {
        friends: true,
      },
    });

    return res.status(201).json({ users: users });
  } catch (error) {
    return res.status(404).json({ error: "Users not found" });
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        friends: true,
      },
    });

    return res.status(201).json({ user: user });
  } catch (error) {
    return res.status(404).json({ error: "User not found" });
  }
}

const updateUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    try {
      const reqUser = req.user;
      const { username, email } = req.body;
      const user = await prisma.user.update({
        where: {
          id: Number(req.user.id),
        },
        data: {
          username: username,
          email: email,
        },
      });
      const friend = await prisma.friend.update({
        where: {
          userId: Number(req.user.id),
        },
        data: {
          username: username,
        },
      });
      return res.status(201).json({ message: "Updated user" });
    } catch (error) {
      return res.status(404).json({ error: "Failed to update user" });
    }
  },
];
async function updateUserStatus(req, res) {
  try {
    const { login } = req.body;
    if (!login) {
      const user = await prisma.user.update({
        where: {
          id: Number(req.user.id),
        },
        data: {
          onlineStatus: false,
          lastSeen: new Date(),
        },
      });
    }

    return res.status(201).json({ message: "Updated user" });
  } catch (error) {
    return res.status(404).json({ error: "Failed to update user" });
  }
}
async function getFriends(req, res) {
  try {
    //return user's friends
    const { userId } = req.params;

    const friends = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        friends: true,
      },
    });
    return res.status(201).json(friends.friends);
  } catch (error) {
    return res.status(404).json({ error: "Failed to get friends" });
  }
}
async function addFriend(req, res) {
  try {
    //return user's friends
    const { friendId } = req.body;
    const reqUser = req.user;
    const curUser = await prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
      include: {
        friends: true,
      },
    });
    const filterFriend = curUser.friends.filter(
      (friend) => friend.friendId == friendId
    );

    if (filterFriend.length === 0) {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(friendId),
        },
      });
      const friends = await prisma.friend.create({
        data: {
          username: user.username,
          friendId: Number(friendId),
          user: {
            connect: {
              id: reqUser.id,
            },
          },
        },
      });
      return res.status(201).json(friends);
    } else {
      return res.status(201).json({ message: "Friend already added" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Failed to add friend" });
  }
}
async function deleteFriend(req, res) {
  try {
    const { friendId } = req.params;
    console.log({ friendId });

    const frienddelete = await prisma.friend.delete({
      where: {
        id: Number(friendId),
      },
    });
    return res.status(201).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Failed to delete user" });
  }
}

async function getUserMessages(req, res) {
  try {
    //return all users
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        sentMessages: true,
        recievedMessages: true,
      },
    });
    return res
      .status(201)
      .json({ messages: user.sentMessages.concat(user.recievedMessages) });
  } catch (error) {
    return res.status(404).json({ error: "Failed to get messages" });
  }
}

async function postUserMessages(req, res) {
  try {
    //return user's friends

    const user = req.user;
    const { userId } = req.params;
    //check if message instance exists
    const recieverMessages = await prisma.message.findFirst({
      where: {
        senderId: req.user.id,
        receiverId: Number(userId),
      },
      include: {
        replies: true,
      },
    });
    const senderMessages = await prisma.message.findFirst({
      where: {
        senderId: Number(userId),
        receiverId: req.user.id,
      },
      include: {
        replies: true,
      },
    });

    if (recieverMessages === null && senderMessages === null) {
      const recieverUser = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      const message = await prisma.message.create({
        data: {
          senderUsername: req.user.username,
          receiverUsername: recieverUser.username,
          sender: {
            connect: {
              id: req.user.id,
            },
          },
          receiver: {
            connect: {
              id: Number(userId),
            },
          },
        },
      });

      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          sentMessages: true,
          recievedMessages: true,
        },
      });

      const messages = user.sentMessages.concat(user.recievedMessages);
      return res.status(201).send({ id: message.id });
    } else {
      return res.status(201).send({
        id: senderMessages === null ? recieverMessages.id : senderMessages.id,
      });
    }
  } catch (error) {
    return res.status(404).json({ error: "Failed to add message" });
  }
}

async function getMessageById(req, res) {
  try {
    //return all users
    const { messageId } = req.params;
    const message = await prisma.message.findFirst({
      where: {
        id: Number(messageId),
      },
      include: {
        replies: true,
      },
    });
    if (message === null) {
      res.status(201).json({ message: [] });
    } else {
      return res.status(201).json({ message: message });
    }
  } catch (error) {
    return res.status(404).json({ error: "Failed to get message" });
  }
}
async function postReplyToMessage(req, res) {
  try {
    //return user's friends
    const user = req.user;

    const { messageId } = req.params;

    const { text } = req.body;
    console.log({ text });
    let postImageUrl = "";
    if (typeof req.file !== "undefined") {
      const fileBase64 = decode(req.file.buffer.toString("base64"));

      const { data, error } = await supabase.storage
        .from("messaging-app")
        .upload(
          `public/${req.user.id}/` + uuidv4() + req.file.originalname,
          fileBase64,
          {
            cacheControl: "5",
            upsert: true,
            contentType: req.file.mimetype,
          }
        );
      if (error) {
        console.log(error);
        return res.status(404).json({ error: error.message });
      } else {
        postImageUrl = supabase.storage
          .from("messaging-app")
          .getPublicUrl(data.path).data.publicUrl;
        console.log({ data, error });
      }
    }

    const reply = await prisma.reply.create({
      data: {
        text: typeof text === "undefined" ? "" : text,
        imageUrl: postImageUrl,
        message: {
          connect: {
            id: Number(messageId),
          },
        },
        authorId: user.id,
      },
    });
    const message = await prisma.message.findFirst({
      where: {
        id: Number(messageId),
      },
      include: {
        replies: true,
      },
    });
    req.io.emit("reply-added", message);

    return res.status(201).json({ message: "Reply sent" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Failed to post reply" });
  }
}
async function getUserGroups(req, res) {
  try {
    //return all users
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        createdGroups: true,
        invitedGroups: true,
      },
    });
    console.log({ user });

    console.log({ groups: user.createdGroups.concat(user.invitedGroups) });

    return res
      .status(201)
      .json({ groups: user.createdGroups.concat(user.invitedGroups) });
  } catch (error) {
    return res.status(404).json({ error: "Failed to get groups" });
  }
}
async function postUserGroups(req, res) {
  try {
    //return user's friends
    const user = req.user;
    const { userId } = req.params;
    const { groupName, members } = req.body;

    console.log({ groupName, userId, members });

    const group = await prisma.group.create({
      data: {
        admin: {
          connect: {
            id: user.id,
          },
        },
        groupName: groupName,
        member: {
          connect: members.map((id) => {
            let i = Number(id.id);
            return { id: i };
          }),
        },
      },
    });
    return res.status(201).send({ id: group.id });
  } catch (error) {
    return res.status(404).json({ error: "Failed to post group" });
  }
}

async function getGroupMessages(req, res) {
  try {
    //return all users
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: {
        id: Number(groupId),
      },
      include: {
        admin: true,
        groupMessages: true,
        member: true,
      },
    });

    return res.status(201).json({ group: group });
  } catch (error) {
    return res.status(404).json({ error: "Failed to get group messages" });
  }
}
async function postGroupMessages(req, res) {
  try {
    //return user's friends
    const user = req.user;

    const { groupId } = req.params;

    const { text } = req.body;
    let postImageUrl = "";
    if (typeof req.file !== "undefined") {
      const fileBase64 = decode(req.file.buffer.toString("base64"));

      const { data, error } = await supabase.storage
        .from("messaging-app")
        .upload(
          `public/${req.user.id}/` + uuidv4() + req.file.originalname,
          fileBase64,
          {
            cacheControl: "5",
            upsert: true,
            contentType: req.file.mimetype,
          }
        );
      if (error) {
        console.log(error);
        return res.status(404).json({ error: error.message });
      } else {
        postImageUrl = supabase.storage
          .from("messaging-app")
          .getPublicUrl(data.path).data.publicUrl;
        console.log({ data, error });
      }
    }

    const message = await prisma.groupMessage.create({
      data: {
        text: typeof text === "undefined" ? "" : text,
        imageUrl: postImageUrl,
        group: {
          connect: {
            id: Number(groupId),
          },
        },
        authorId: user.id,
      },
    });
    const group = await prisma.group.findUnique({
      where: {
        id: Number(groupId),
      },
      include: {
        groupMessages: true,
        member: true,
      },
    });
    req.io.emit("group-msg-added", group);

    return res.status(201).json({ message: "Message sent" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Failed to post group message" });
  }
}
module.exports = {
  allUsers,
  getUser,
  updateUser,
  updateUserStatus,
  getFriends,
  addFriend,
  deleteFriend,
  getUserMessages,
  postUserMessages,
  getMessageById,
  postReplyToMessage,
  getUserGroups,
  postUserGroups,
  getGroupMessages,
  postGroupMessages,
};
