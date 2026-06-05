-- Enum for announcement status if it doesn't exist
DO $$ BEGIN
    CREATE TYPE announcement_status AS ENUM ('draft', 'pending', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL, -- FK to buildings if it exists
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT false,
    status announcement_status DEFAULT 'pending',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.announcement_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enable
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_attachments ENABLE ROW LEVEL SECURITY;

-- Policies for announcements
-- SELECT: Admins can see all, others can see 'published' and 'archived'
CREATE POLICY "Everyone can see published or archived announcements"
    ON public.announcements FOR SELECT
    USING (status IN ('published', 'archived'));

CREATE POLICY "Admins can see all announcements"
    ON public.announcements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Authors can see their own pending announcements"
    ON public.announcements FOR SELECT
    USING (author_id = auth.uid());

-- INSERT: Admins can insert any, others can insert 'pending'
CREATE POLICY "Admins can insert announcements"
    ON public.announcements FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Users can submit pending announcements"
    ON public.announcements FOR INSERT
    WITH CHECK (
        author_id = auth.uid() AND status = 'pending' AND is_important = false
    );

-- UPDATE: Admins can update any, authors can update their own 'pending'
CREATE POLICY "Admins can update any announcement"
    ON public.announcements FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Authors can update their own pending announcements"
    ON public.announcements FOR UPDATE
    USING (author_id = auth.uid() AND status = 'pending');

-- DELETE: Admins can delete any, authors can delete their own 'pending'
CREATE POLICY "Admins can delete any announcement"
    ON public.announcements FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Authors can delete their own pending announcements"
    ON public.announcements FOR DELETE
    USING (author_id = auth.uid() AND status = 'pending');


-- Policies for attachments
CREATE POLICY "Everyone can see attachments for published/archived announcements"
    ON public.announcement_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM announcements a 
            WHERE a.id = announcement_attachments.announcement_id 
            AND a.status IN ('published', 'archived')
        )
    );

CREATE POLICY "Authors can see their own attachments"
    ON public.announcement_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM announcements a 
            WHERE a.id = announcement_attachments.announcement_id 
            AND a.author_id = auth.uid()
        )
    );

CREATE POLICY "Admins can see all attachments"
    ON public.announcement_attachments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Authors can insert attachments for their own announcements"
    ON public.announcement_attachments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM announcements a 
            WHERE a.id = announcement_attachments.announcement_id 
            AND a.author_id = auth.uid()
        )
    );

CREATE POLICY "Authors can delete attachments for their own pending announcements"
    ON public.announcement_attachments FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM announcements a 
            WHERE a.id = announcement_attachments.announcement_id 
            AND a.author_id = auth.uid()
            AND a.status = 'pending'
        )
    );
