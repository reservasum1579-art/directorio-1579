-- Políticas RLS para el bucket 'images'
-- Permite a cualquiera ver las imágenes (bucket público)
CREATE POLICY "Public read access on images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Permite a usuarios autenticados subir imágenes
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Permite a usuarios autenticados actualizar sus propias imágenes
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'images' );

-- Permite a usuarios autenticados borrar sus propias imágenes
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );
