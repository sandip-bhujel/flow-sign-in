-- Update the RLS policy to allow anonymous users to insert during signup
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.signup;

-- Create a new policy that allows anyone to insert into signup table
CREATE POLICY "Allow anonymous signup insertions" 
ON public.signup 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);