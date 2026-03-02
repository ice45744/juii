import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "./components/AppLayout";
import NotFound from "@/pages/not-found";

import Login from "./pages/login";
import Home from "./pages/home";
import Activities from "./pages/activities";
import Announcements from "./pages/announcements";
import Report from "./pages/report";
import Profile from "./pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/activities" component={Activities} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/report" component={Report} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
