import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient("https://bvztzeuetxikaevnuteo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2enR6ZXVldHhpa2Fldm51dGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjgxNTgsImV4cCI6MjA3MzEwNDE1OH0.7G87tOLIDm0FU6JtY1UF0ZA8SxsEhv7QwAFl357POrQ")
}
