import multer from "multer";

const upload = multer({ dest: "uploads/" });

const productImage = upload.array("image", 10);

const profilePicture = upload.single("profilePic");

const reviewVideo = upload.single("video")

export { productImage, profilePicture, reviewVideo };
