// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://trclprbzqagiaveznvmn.supabase.co' // reemplaza esto
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyY2xwcmJ6cWFnaWF2ZXpudm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3OTE5MjMsImV4cCI6MjA2MDM2NzkyM30.rPqlbDfzxsq6QG-0PAmNEdQqcVX89PV5r6Gs4zLKEz8' // reemplaza esto también

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
