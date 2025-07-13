import multer from "multer";

const upload = multer({ dest: "uploads/" });

const productImage = upload.array("image", 10);

const profilePicture = upload.single("profilePic");

export { productImage, profilePicture };
