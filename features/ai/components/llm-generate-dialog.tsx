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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2, WandIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LLMGenerateDialogProps {
  type: string;
  generateBy: string;
  disabled?: boolean;
  onSelect?: (content: string) => void;
}

const LLMGenerateDialog = ({ type, generateBy, disabled, onSelect }: LLMGenerateDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const handleGenerate = async () => {
    setIsDone(false);
    setLoading(true);
    setOptions([]);
    setCurrentResponse('');

    try {
      const response = await fetch(`/api/ai/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generateBy,
        }),
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        toast.error(error);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsDone(true);
          // 确保在流式响应结束时获取完整的响应内容
          const finalResponse = fullResponse + buffer;
          setCurrentResponse(finalResponse);
          setOptions(JSON.parse(finalResponse));
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            // 检查 DONE 标识
            if (line.trim() === 'data: [DONE]') {
              continue;
            }
            try {
              // 将 "data: " 去掉后解析 JSON 数据
              const data = JSON.parse(line.slice(6));
              // 根据 OpenAI 接口格式，提取 delta 信息
              const content = data.choices?.[0]?.delta?.content || '';
              fullResponse += content;
              setCurrentResponse((prev) => prev + content);
            } catch (error) {
              console.error('解析响应数据失败:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (content: string) => {
    onSelect?.(content);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn('h-4 w-4', disabled && '!opacity-30')}
          title="LLM Generate"
          disabled={disabled}
        >
          <WandIcon className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate {type}</DialogTitle>
          <DialogDescription>
            Based on your content, we&apos;ll generate multiple options for you to choose from.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Original</Label>
            <Textarea value={generateBy} readOnly className="max-h-[100px] resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Options</Label>
            {isDone ? (
              <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelect(option)}
                    className="h-auto max-w-full py-2 text-left whitespace-normal"
                  >
                    <span className="line-clamp-3">{option}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <Textarea value={currentResponse} readOnly />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandIcon className="h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LLMGenerateDialog;
