'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SettingsIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGetLLMConfig } from '../api/use-get-llm-config';
import { useUpdateLLMConfig } from '../api/use-update-llm-config';
import { updateLLMConfigSchema } from '../schemas';

const LLMConfigDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: llmConfig } = useGetLLMConfig();
  const { mutate: updateLLMConfig, isPending } = useUpdateLLMConfig();

  const form = useForm<z.infer<typeof updateLLMConfigSchema>>({
    resolver: zodResolver(updateLLMConfigSchema),
    defaultValues: llmConfig,
  });

  useEffect(() => {
    if (llmConfig) {
      form.reset(llmConfig);
    }
  }, [llmConfig, form]);

  function onSubmit(values: z.infer<typeof updateLLMConfigSchema>) {
    updateLLMConfig(
      { json: values },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SettingsIcon />
          LLM Config
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>LLM Config</DialogTitle>
          <DialogDescription>You can configure the LLM model, endpoint, and API key here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="model name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint</FormLabel>
                  <FormControl>
                    <Input placeholder="start with https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="sk-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isPending} onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LLMConfigDialog;
