import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => (
  <UserProfile path="/user-profile" routing="path" />
);

export default ProfilePage;