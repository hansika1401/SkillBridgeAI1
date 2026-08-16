'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { doc, getDoc } from 'firebase/firestore';

const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  mobile: z.string().min(8, { message: 'Mobile is required.' }),
  degree: z.string().min(2, { message: 'Degree is required.' }),
  college: z.string().min(2, { message: 'College is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string().min(8, { message: 'Confirm your password.' }),
  skills: z.string().optional(),
  goal: z.string().optional(),
}).refine((v) => v.password === v.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function AuthPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get('redirect') || '/dashboard';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', mobile: '', degree: '', college: '', email: '', password: '', confirmPassword: '', skills: '', goal: '' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (!auth) return;
    setIsSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      // If displayName is empty, try to sync from Firestore profile name
      try {
        const { firestore } = initializeFirebase();
        if (cred.user && !cred.user.displayName) {
          const ref = doc(firestore, 'users', cred.user.uid);
          const snap = await getDoc(ref);
          const profileName = snap.exists() ? (snap.data() as any)?.name : undefined;
          if (profileName) {
            await updateProfile(cred.user, { displayName: profileName });
          }
        }
      } catch {
        // non-fatal if profile is unavailable
      }
      toast({ title: 'Success', description: 'Logged in successfully!' });
      router.replace(redirectTarget);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    if (!auth) return;
    setIsSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Set display name in Firebase Auth profile for immediate UI fallback
      if (cred.user) {
        await updateProfile(cred.user, { displayName: values.name });
      }
      // Persist profile details in Firestore via API
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: cred.user.uid,
          name: values.name,
          mobile: values.mobile,
          degree: values.degree,
          college: values.college,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          skills: (values.skills || '').split(',').map(s => s.trim()).filter(Boolean),
          goal: values.goal || '',
        }),
      });
      toast({ title: 'Success', description: 'Account created successfully!' });
      router.replace(redirectTarget);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Logged in with Google!' });
      router.replace(redirectTarget);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 animated-gradient">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary-foreground dark:text-foreground">
          <BrainCircuit className="h-8 w-8" />
          <h1>SkillBridge AI</h1>
        </div>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@university.edu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>
              <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-muted" />
                <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
                <div className="flex-grow border-t border-muted" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Start your journey with SkillBridge AI today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signUpForm}>
                <form
                  onSubmit={signUpForm.handleSubmit(handleSignUp)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormField
                    control={signUpForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="Degree" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="college"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>College</FormLabel>
                        <FormControl>
                          <Input placeholder="College name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@university.edu"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Your skills (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., JavaScript, React, SQL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Career Goal</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Developer, Data Scientist" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-1 md:col-span-2 mt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </div>
                </form>
              </Form>
               <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-muted" />
                <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
                <div className="flex-grow border-t border-muted" />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                Sign up with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
