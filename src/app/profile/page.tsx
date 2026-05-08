// ============================================
// TOOLVAULT PRO — PROFILE PAGE
// ============================================
'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Edit3, Save, Camera,
  Trash2, Shield, LogOut, Zap,
  Check, AlertTriangle
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { DarkModeToggle } from '@/components/features/DarkModeToggle'
import { ReferralCard } from '@/components/features/ReferralCard'
import { ExportButton } from '@/components/features/ExportButton'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { toast } from 'sonner'
import Image from 'next/image'
import { clsx } from 'clsx'

export default function ProfilePage() {
  const {
    user, profile,
    updateUserProfile, uploadAvatar,
    signOut
  } = useAuth()
  const { language, setLanguage } = useUIStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    username: profile?.username ?? '',
    full_name: profile?.full_name ?? '',
    bio: profile?.bio ?? '',
    language: profile?.language ?? 'en',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateUserProfile({
        username: form.username,
        full_name: form.full_name,
        bio: form.bio,
        language: form.language as 'en' | 'ur',
      })

      if (result.success) {
        setLanguage(form.language as 'en' | 'ur')
        toast.success('Profile updated!')
        setIsEditing(false)
      } else {
        toast.error(result.error ?? 'Update failed')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large. Max 2MB')
      return
    }

    toast.loading('Uploading avatar...')
    const result = await uploadAvatar(file)
    toast.dismiss()

    if (result.success) {
      toast.success('Avatar updated!')
    } else {
      toast.error(result.error ?? 'Upload failed')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch('/api/profile', { method: 'DELETE' })
      if (res.ok) {
        await signOut()
        toast.success('Account deleted')
      }
    } catch {
      toast.error('Delete failed')
    }
  }

  const STATS = [
    { label: 'Tools Used', value: profile?.tools_used_count ?? 0, icon: Zap },
    { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }) : '—', icon: Check },
    { label: 'Language', value: profile?.language === 'ur' ? 'اردو' : 'English', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="container-main py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-900">
            My Profile
          </h1>
          <p className="text-surface-500 text-sm">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="card p-6 mb-5">
          {/* Avatar + Name */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 overflow-hidden ring-4 ring-primary-50">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-700">
                      {(profile?.username ?? 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-colors"
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-surface-900">
                @{profile?.username ?? 'username'}
              </h2>
              <p className="text-sm text-surface-500 truncate">
                {user?.email}
              </p>
              {profile?.bio && (
                <p className="text-xs text-surface-600 mt-1 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={clsx(
                'flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all',
                isEditing
                  ? 'bg-surface-100 text-surface-600'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              )}
            >
              <Edit3 size={13} />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center p-3 bg-surface-50 rounded-xl">
                <Icon size={15} className="text-primary-500 mx-auto mb-1" />
                <p className="text-base font-bold text-surface-900">{value}</p>
                <p className="text-xs text-surface-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-surface-100 pt-5"
            >
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm">@</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="input pl-7"
                    maxLength={30}
                  />
                </div>
              </div>

              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input"
                  maxLength={100}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value.substring(0, 160) })}
                  className="input resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                  maxLength={160}
                />
                <p className="text-xs text-surface-400 mt-1 text-right">{form.bio.length}/160</p>
              </div>

              <div>
                <label className="label">Language</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'en', label: '🇬🇧 English' },
                    { value: 'ur', label: '🇵🇰 اردو' },
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setForm({ ...form, language: lang.value })}
                      className={clsx(
                        'py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all',
                        form.language === lang.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-surface-200 text-surface-600 hover:border-primary-300'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                whileTap={{ scale: 0.97 }}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Theme */}
        <div className="card p-5 mb-5">
          <h3 className="text-sm font-bold text-surface-900 mb-3">
            Appearance
          </h3>
          <DarkModeToggle variant="full" />
        </div>

        {/* Referral */}
        <div className="mb-5">
          <ReferralCard />
        </div>

        {/* Data Export */}
        <div className="card p-5 mb-5">
          <h3 className="text-sm font-bold text-surface-900 mb-1">
            Your Data
          </h3>
          <p className="text-xs text-surface-500 mb-4">
            Download all your data in CSV or JSON format
          </p>
          <div className="flex gap-3">
            <ExportButton type="usage" />
            <ExportButton type="saved" />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-5 border-danger-200 border-2">
          <h3 className="text-sm font-bold text-danger-700 mb-1 flex items-center gap-2">
            <AlertTriangle size={14} />
            Danger Zone
          </h3>
          <p className="text-xs text-surface-500 mb-4">
            These actions are permanent and cannot be undone.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
            >
              <LogOut size={15} />
              Sign Out
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-danger-200 rounded-xl text-sm font-semibold text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <Trash2 size={15} />
                Delete Account
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-danger-50 rounded-xl border border-danger-200"
              >
                <p className="text-xs text-danger-700 font-semibold mb-3">
                  ⚠️ Are you sure? This will permanently delete your account and all data.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 btn-secondary text-xs py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-danger-600 text-white text-xs py-2 rounded-xl font-semibold hover:bg-danger-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
