import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

const ApiKeyInput = ({ onApiKeySet, hasApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsLoading(true);
    try {
      onApiKeySet(apiKey.trim());
      toast.success('API key configured successfully!');
      setApiKey(''); // Clear input for security
    } catch (error) {
      toast.error('Failed to configure API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasApiKey) {
    return null;
  }

  return (
    <Card className="artisan-card max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-saffron" />
          <span>Configure KalaKriti AI</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Runware API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Runware API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://runware.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron hover:underline inline-flex items-center"
              >
                Runware.ai <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </p>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Configuring...' : 'Start Creating with AI'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;