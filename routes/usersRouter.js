const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/multer");

//user - admin
usersRouter.get("/", authenticate, usersController.allUsers);
usersRouter.get("/:userId", authenticate, usersController.getUser);
usersRouter.put("/:userId", authenticate, usersController.updateUser);
usersRouter.put(
  "/:userId/status",
  authenticate,
  usersController.updateUserStatus
);

usersRouter.get("/:userId/friends", authenticate, usersController.getFriends);
usersRouter.post("/:userId/friends", authenticate, usersController.addFriend);
usersRouter.delete(
  "/:userId/friends/:friendId",
  authenticate,
  usersController.deleteFriend
);

usersRouter.get(
  "/:userId/messages",
  authenticate,
  usersController.getUserMessages
);
usersRouter.post(
  "/:userId/messages",
  authenticate,
  usersController.postUserMessages
);

usersRouter.get(
  "/:userId/messages/:messageId",
  authenticate,
  usersController.getMessageById
);
usersRouter.post(
  "/:userId/messages/:messageId",
  upload.single("image"),
  authenticate,
  usersController.postReplyToMessage
);

usersRouter.get("/:userId/groups", authenticate, usersController.getUserGroups);
usersRouter.post(
  "/:userId/groups",
  authenticate,
  usersController.postUserGroups
);

usersRouter.get(
  "/:userId/groups/:groupId",
  authenticate,
  usersController.getGroupMessages
);
usersRouter.post(
  "/:userId/groups/:groupId",
  upload.single("image"),
  authenticate,
  usersController.postGroupMessages
);

module.exports = usersRouter;
