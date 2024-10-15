import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owszigyecoridnqggnln.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93c3ppZ3llY29yaWRucWdnbmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5NTA3NjksImV4cCI6MjA0NDUyNjc2OX0.PaCtj8Y4E6pSiZ4pSj_yImtOD1eGRjOwFcEbJvvgeck'

export const supabase = createClient(supabaseUrl, supabaseKey)