'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

const SignOutButton = () => {
  return (
    <Button variant="outline" size="icon" onClick={() => signOut()}>
      <LogOut />
    </Button>
  );
};

export default SignOutButton;
