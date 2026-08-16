"use client";

import { useState, useEffect } from "react";
import { useUser, useDoc, initializeFirebase } from "@/firebase";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Save, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  Zap,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Key,
  CreditCard,
  HelpCircle,
  LogOut,
  Plus,
  X
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

type UserProfile = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  goal?: string;
  college?: string;
  degree?: string;
  experience?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
      marketing?: boolean;
      updates?: boolean;
    };
    privacy?: {
      profileVisible?: boolean;
      skillsVisible?: boolean;
      contactVisible?: boolean;
    };
    ai?: {
      provider?: 'omnidim' | 'openai' | 'google';
      responseStyle?: 'concise' | 'detailed' | 'friendly';
      language?: string;
    };
  };
};

export default function SettingsPage() {
  const { user } = useUser();
  const { firestore } = initializeFirebase();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [newSkill, setNewSkill] = useState("");
  const [currentTheme, setCurrentTheme] = useState("system");

  // User profile data
  const profileRef = user?.uid ? doc(firestore, "users", user.uid) : null;
  const { data: profile } = useDoc<UserProfile>(profileRef);

  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    goal: "",
    college: "",
    degree: "",
    experience: "",
    preferences: {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        marketing: false,
        updates: true,
      },
      privacy: {
        profileVisible: true,
        skillsVisible: true,
        contactVisible: false,
      },
      ai: {
        provider: 'omnidim',
        responseStyle: 'friendly',
        language: 'en',
      },
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        email: profile.email || user?.email || "",
        preferences: {
          theme: profile.preferences?.theme || 'system',
          notifications: {
            email: profile.preferences?.notifications?.email ?? true,
            push: profile.preferences?.notifications?.push ?? true,
            marketing: profile.preferences?.notifications?.marketing ?? false,
            updates: profile.preferences?.notifications?.updates ?? true,
          },
          privacy: {
            profileVisible: profile.preferences?.privacy?.profileVisible ?? true,
            skillsVisible: profile.preferences?.privacy?.skillsVisible ?? true,
            contactVisible: profile.preferences?.privacy?.contactVisible ?? false,
          },
          ai: {
            provider: profile.preferences?.ai?.provider || 'omnidim',
            responseStyle: profile.preferences?.ai?.responseStyle || 'friendly',
            language: profile.preferences?.ai?.language || 'en',
          },
        },
      });
    }
  }, [profile, user]);

  const saveSettings = async () => {
    if (!profileRef) return;
    
    setLoading(true);
    try {
      await updateDoc(profileRef, formData);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "ai", label: "AI Settings", icon: Zap },
    { id: "account", label: "Account", icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                        activeTab === tab.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback className="text-lg">
                        {formData.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  {/* Education & Career */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        value={formData.college || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                        placeholder="Your institution"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        value={formData.degree || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                        placeholder="Your degree"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select
                        value={formData.experience || ""}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal">Career Goal</Label>
                      <Input
                        id="goal"
                        value={formData.goal || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                        placeholder="e.g., Frontend Developer"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button onClick={() => removeSkill(skill)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "light", label: "Light", icon: Sun },
                        { value: "dark", label: "Dark", icon: Moon },
                        { value: "system", label: "System", icon: Monitor },
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <button
                            key={themeOption.value}
                            onClick={() => {
                              setCurrentTheme(themeOption.value);
                              setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  theme: themeOption.value as any
                                }
                              }));
                            }}
                            className={`flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors ${
                              currentTheme === themeOption.value ? "border-primary bg-accent" : ""
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm">{themeOption.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Language */}
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={formData.preferences?.ai?.language || "en"}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          ai: { ...prev.preferences?.ai, language: value }
                        }
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Zone */}
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="ist">India Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      key: "email",
                      label: "Email Notifications",
                      description: "Receive notifications via email",
                      icon: Mail,
                    },
                    {
                      key: "push",
                      label: "Push Notifications",
                      description: "Receive push notifications in browser",
                      icon: Bell,
                    },
                    {
                      key: "marketing",
                      label: "Marketing Emails",
                      description: "Receive updates about new features and tips",
                      icon: Volume2,
                    },
                    {
                      key: "updates",
                      label: "Product Updates",
                      description: "Get notified about important updates",
                      icon: Zap,
                    },
                  ].map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div key={notification.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{notification.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.preferences?.notifications?.[notification.key as keyof typeof formData.preferences.notifications] ?? true}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                notifications: {
                                  ...prev.preferences?.notifications,
                                  [notification.key]: checked
                                }
                              }
                            }))
                          }
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      key: "profileVisible",
                      label: "Public Profile",
                      description: "Make your profile visible to other users",
                      icon: Eye,
                    },
                    {
                      key: "skillsVisible",
                      label: "Skills Visibility",
                      description: "Show your skills to mentors and recruiters",
                      icon: Target,
                    },
                    {
                      key: "contactVisible",
                      label: "Contact Information",
                      description: "Allow others to see your contact details",
                      icon: Phone,
                    },
                  ].map((privacy) => {
                    const Icon = privacy.icon;
                    return (
                      <div key={privacy.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{privacy.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {privacy.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.preferences?.privacy?.[privacy.key as keyof typeof formData.preferences.privacy] ?? true}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                privacy: {
                                  ...prev.preferences?.privacy,
                                  [privacy.key]: checked
                                }
                              }
                            }))
                          }
                        />
                      </div>
                    );
                  })}

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Data Management</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Settings */}
            {activeTab === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Assistant Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Provider */}
                  <div className="space-y-2">
                    <Label>AI Provider</Label>
                    <Select
                      value={formData.preferences?.ai?.provider || "omnidim"}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          ai: { ...prev.preferences?.ai, provider: value as any }
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnidim">Omnidim AI (Recommended)</SelectItem>
                        <SelectItem value="openai">OpenAI GPT</SelectItem>
                        <SelectItem value="google">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Response Style */}
                  <div className="space-y-2">
                    <Label>Response Style</Label>
                    <Select
                      value={formData.preferences?.ai?.responseStyle || "friendly"}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          ai: { ...prev.preferences?.ai, responseStyle: value as any }
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AI Features */}
                  <div className="space-y-4">
                    <h3 className="font-medium">AI Features</h3>
                    {[
                      "Career Path Recommendations",
                      "Skill Gap Analysis",
                      "Resume Optimization",
                      "Interview Preparation",
                      "Project Suggestions",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{feature}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account */}
            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Security */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Security</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Billing */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Billing & Subscription</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Billing History
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Support */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Support</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help Center
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Danger Zone */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-destructive">Danger Zone</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                      <Button variant="destructive" className="w-full justify-start">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={loading} size="lg">
                {loading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
