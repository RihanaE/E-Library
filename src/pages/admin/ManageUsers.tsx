import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  ArrowLeft,
  MoreHorizontal,
  Shield,
  ShieldOff,
  UserCog,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  grade: string | null;
  created_at: string;
  roles: AppRole[];
}

export default function ManageUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast.error("Failed to fetch users");
      setIsLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast.error("Failed to fetch roles");
    }

    const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => ({
      ...profile,
      roles: (roles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role),
    }));

    setUsers(usersWithRoles);
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    // First remove existing roles
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Add new role
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: newRole,
    });

    if (error) {
      toast.error("Failed to update role");
    } else {
      toast.success("Role updated successfully");
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "teacher":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              {users.length} registered users
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden lg:table-cell">Grade</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground hidden sm:table-cell">Joined</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 last:border-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-medium">
                            {(user.first_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : "Unknown User"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{user.email || "N/A"}</span>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {user.grade ? `Grade ${user.grade}` : "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleBadgeColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, "admin")}>
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, "teacher")}>
                            <UserCog className="h-4 w-4 mr-2" />
                            Make Teacher
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, "student")}>
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Make Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "No users found matching your search" : "No users registered yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
