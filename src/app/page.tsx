import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
            Next.js + Tailwind + shadcn/ui
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            A modern web development stack with beautiful components
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="secondary">Next.js 15</Badge>
            <Badge variant="secondary">React 19</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">TypeScript</Badge>
          </div>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Various button styles and variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>
                Input fields and form components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter your email" type="email" />
              <Input placeholder="Enter your name" />
              <Button className="w-full">Submit Form</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog Component</CardTitle>
              <CardDescription>Modal dialogs and overlays</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Welcome to the Demo</DialogTitle>
                    <DialogDescription>
                      This is a sample dialog built with shadcn/ui components.
                      It demonstrates the modal functionality with proper
                      accessibility.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Confirm</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8">
            What&apos;s Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Next.js 15</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Latest Next.js with App Router, Server Components, and React 19
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Utility-first CSS framework for rapid UI development
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">shadcn/ui</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Beautiful, accessible components built with Radix UI
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">TypeScript</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Full type safety and excellent developer experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
