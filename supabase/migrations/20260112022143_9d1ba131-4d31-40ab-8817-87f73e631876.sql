-- Create payment_configs table for storing user's PixGo API keys
CREATE TABLE public.payment_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  pixgo_api_key TEXT,
  is_configured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for user_id
CREATE INDEX idx_payment_configs_user_id ON public.payment_configs(user_id);

-- Enable Row Level Security
ALTER TABLE public.payment_configs ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only access their own config
CREATE POLICY "Users can view their own payment config" 
ON public.payment_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment config" 
ON public.payment_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment config" 
ON public.payment_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_payment_configs_updated_at
BEFORE UPDATE ON public.payment_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();