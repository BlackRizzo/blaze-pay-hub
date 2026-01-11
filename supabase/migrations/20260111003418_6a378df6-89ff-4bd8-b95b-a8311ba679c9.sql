-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bots table
CREATE TABLE public.bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create randomizers table
CREATE TABLE public.randomizers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL DEFAULT 'random' CHECK (mode IN ('random', 'weighted')),
  active BOOLEAN NOT NULL DEFAULT true,
  cloaker_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create randomizer_bots junction table
CREATE TABLE public.randomizer_bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  randomizer_id UUID NOT NULL REFERENCES public.randomizers(id) ON DELETE CASCADE,
  bot_id UUID NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  weight INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_reserve BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visits table
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  randomizer_id UUID REFERENCES public.randomizers(id) ON DELETE SET NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create utmify_configs table
CREATE TABLE public.utmify_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  randomizer_id UUID NOT NULL UNIQUE REFERENCES public.randomizers(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  api_token TEXT,
  utm_script TEXT,
  pixel_script TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create native_pixels table
CREATE TABLE public.native_pixels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  randomizer_id UUID NOT NULL REFERENCES public.randomizers(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('meta', 'google', 'tiktok', 'other')),
  pixel_id TEXT NOT NULL,
  access_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.randomizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.randomizer_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utmify_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.native_pixels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bots
CREATE POLICY "Users can view their own bots" ON public.bots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bots" ON public.bots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bots" ON public.bots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bots" ON public.bots FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for randomizers
CREATE POLICY "Users can view their own randomizers" ON public.randomizers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own randomizers" ON public.randomizers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own randomizers" ON public.randomizers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own randomizers" ON public.randomizers FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for randomizer_bots (via randomizer ownership)
CREATE POLICY "Users can view randomizer_bots for their randomizers" ON public.randomizer_bots FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create randomizer_bots for their randomizers" ON public.randomizer_bots FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update randomizer_bots for their randomizers" ON public.randomizer_bots FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete randomizer_bots for their randomizers" ON public.randomizer_bots FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);

-- RLS Policies for sales
CREATE POLICY "Users can view their own sales" ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sales" ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for visits
CREATE POLICY "Users can view their own visits" ON public.visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own visits" ON public.visits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for utmify_configs (via randomizer ownership)
CREATE POLICY "Users can view utmify_configs for their randomizers" ON public.utmify_configs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create utmify_configs for their randomizers" ON public.utmify_configs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update utmify_configs for their randomizers" ON public.utmify_configs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete utmify_configs for their randomizers" ON public.utmify_configs FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);

-- RLS Policies for native_pixels (via randomizer ownership)
CREATE POLICY "Users can view native_pixels for their randomizers" ON public.native_pixels FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create native_pixels for their randomizers" ON public.native_pixels FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update native_pixels for their randomizers" ON public.native_pixels FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete native_pixels for their randomizers" ON public.native_pixels FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.randomizers WHERE id = randomizer_id AND user_id = auth.uid())
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON public.bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_randomizers_updated_at BEFORE UPDATE ON public.randomizers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_utmify_configs_updated_at BEFORE UPDATE ON public.utmify_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();