"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProject } from '@/contexts/ProjectContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Save, 
  Download, 
  Trash2, 
  Star, 
  ArrowRight, 
  Map,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { STEP_TYPES, getStepTypeById, getStepTypeByLabel } from '@/lib/step-types'

export default function DashboardContent() {
  // ...all the dashboard logic and JSX from the previous DashboardPage function...
} 