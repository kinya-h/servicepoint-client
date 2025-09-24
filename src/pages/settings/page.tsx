import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";

import {
  updateUserProfile,
  changePassword,
  deleteAccount,
} from "../../services/user-service";
import { useAppDispatch } from "../../hooks/hooks";
import { Bounce, toast, ToastContainer } from "react-toastify";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { loginResponse, loading } = useSelector(
    (state: RootState) => state.users
  );

  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (loginResponse?.user) {
      setForm({
        username: loginResponse.user.username || "",
        email: loginResponse.user.email || "",
        phoneNumber: loginResponse.user.phoneNumber || "",
      });

      console.log("USER=>", loginResponse);
    }
  }, [loginResponse]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await dispatch(
      updateUserProfile({ ...form, id: loginResponse?.user?.id })
    );
    if (response.meta.requestStatus === "fulfilled") {
      toast.success(`Profile updated successfully.`);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(changePassword(passwords));
    setPasswords({ currentPassword: "", newPassword: "" });
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      dispatch(deleteAccount(loginResponse?.user?.id));
    }
  };

  if (loading || !loginResponse) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      {/* Profile Settings */}
      <Card className="shadow-lg border-primary border-t-4">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="shadow-lg border-accent border-t-4">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>
            <Button type="submit" variant="outline" className="w-full">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="shadow-lg border-red-500 border-t-4">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-red-600">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
