import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { contactsData, departments, statuses, roles, type Contact } from '@/data'
import { useLocale } from '@/i18n'

// Empty contact form data
const emptyFormData = {
  name: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  location: '',
  status: 'active' as Contact['status'],
  bio: '',
  avatar: '',
}

/**
 * Contacts Page Component
 * Displays a list of contacts with full CRUD functionality
 */
export function ContactsPage() {
  const { t, locale } = useLocale()
  const [contacts, setContacts] = useState<Contact[]>(contactsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  
  // Add/Edit form states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState(emptyFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState<string>('')

  // Filter contacts based on search and filters
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = filterDepartment === 'All' || contact.department === filterDepartment
    const matchesStatus = filterStatus === 'All' || contact.status === filterStatus.toLowerCase()
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Handle view contact
  const handleView = (contact: Contact) => {
    setSelectedContact(contact)
    setIsViewModalOpen(true)
  }

  // Handle add new contact
  const handleAddNew = () => {
    setIsEditMode(false)
    setFormData(emptyFormData)
    setAvatarPreview('')
    setFormErrors({})
    setIsFormModalOpen(true)
  }

  // Handle edit contact
  const handleEdit = (contact: Contact) => {
    setIsEditMode(true)
    setSelectedContact(contact)
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      role: contact.role,
      department: contact.department,
      location: contact.location,
      status: contact.status,
      bio: contact.bio,
      avatar: contact.avatar,
    })
    setAvatarPreview(contact.avatar)
    setFormErrors({})
    setIsFormModalOpen(true)
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors({ ...formErrors, avatar: 'Please select an image file' })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({ ...formErrors, avatar: 'Image size should be less than 5MB' })
        return
      }
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setFormData({ ...formData, avatar: result })
        setFormErrors({ ...formErrors, avatar: '' })
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setAvatarPreview('')
    setFormData({ ...formData, avatar: '' })
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    if (!formData.role.trim()) errors.role = 'Role is required'
    if (!formData.department.trim()) errors.department = 'Department is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (isEditMode && selectedContact) {
      // Update existing contact
      setContacts(contacts.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              ...formData,
              avatar: formData.avatar || c.avatar, // Keep existing avatar if not changed
            }
          : c
      ))
    } else {
      // Add new contact
      const { avatar: formAvatar, ...restFormData } = formData
      const newContact: Contact = {
        id: Math.max(...contacts.map((c) => c.id)) + 1,
        avatar: formAvatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        ...restFormData,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
      }
      setContacts([newContact, ...contacts])
    }

    setIsFormModalOpen(false)
    setFormData(emptyFormData)
    setAvatarPreview('')
  }

  // Handle delete click
  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter((c) => c.id !== contactToDelete.id))
      setIsDeleteDialogOpen(false)
      setContactToDelete(null)
    }
  }

  // Clear filters
  const clearFilters = () => {
    setFilterDepartment('All')
    setFilterStatus('All')
  }

  // Get active filter count
  const activeFilterCount = [filterDepartment, filterStatus].filter((f) => f !== 'All').length

  // Get status badge styles
  const getStatusStyles = (status: Contact['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700'
      case 'inactive':
        return 'bg-secondary-100 text-secondary-600'
      case 'pending':
        return 'bg-warning-100 text-warning-700'
      default:
        return 'bg-secondary-100 text-secondary-600'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900">{t('contacts.title')}</h1>
          <p className="text-body-sm text-secondary-500 mt-1">
            {t('contacts.description')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-secondary-500">
            {filteredContacts.length} {t('contacts.title').toLowerCase()}
          </span>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Icon icon={Icons.plus} width={16} height={16} />
            {t('contacts.add_contact')}
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Icon icon={Icons.search} width={20} height={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder={t('contacts.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
            />
          </div>
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'bg-theme-primary-light border-theme-primary/30 text-theme-primary'
                  : 'bg-surface-50 border-surface-200 text-secondary-700 hover:bg-surface-100'
              }`}
            >
              <Icon icon={Icons.filter} width={16} height={16} />
              {t('contacts.filter')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-theme-primary text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <Icon icon={Icons.chevronDown} width={16} height={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-[1040]" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-surface-200 z-[1050] animate-fade-in">
                  <div className="p-4 border-b border-surface-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-secondary-900">{t('contacts.filter.filters')}</h3>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-theme-primary hover:underline"
                        >
                          {t('contacts.filter.clear_all')}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Department Filter */}
                    <div>
                      <label className="block text-xs font-medium text-secondary-700 mb-2">
                        {t('contacts.filter.department')}
                      </label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept === 'All' ? t('common.all') : t(`contacts.department.${dept.toLowerCase().replace(/\s+/g, '_')}`)}</option>
                        ))}
                      </select>
                    </div>
                    {/* Status Filter */}
                    <div>
                      <label className="block text-xs font-medium text-secondary-700 mb-2">
                        {t('contacts.filter.status')}
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>{status === 'All' ? t('common.all') : t(`contacts.status.${status.toLowerCase()}`)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="p-4 border-t border-surface-200">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      {t('contacts.filter.apply')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.contact')}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.phone')}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.role')}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.department')}
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.status')}
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {t('contacts.column.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-surface-50 transition-colors"
                >
                  {/* Contact Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          {contact.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Phone */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-600">
                      {contact.phone}
                    </span>
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-900">
                      {contact.role}
                    </span>
                  </td>
                  {/* Department */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-600">
                      {contact.department}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(contact.status)}`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(contact)}
                        className="p-2 hover:bg-surface-100 rounded-lg text-secondary-500 hover:text-theme-primary transition-colors"
                        title="View details"
                      >
                        <Icon icon={Icons.eye} width={16} height={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(contact)}
                        className="p-2 hover:bg-surface-100 rounded-lg text-secondary-500 hover:text-info-600 transition-colors"
                        title="Edit contact"
                      >
                        <Icon icon={Icons.edit} width={16} height={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(contact)}
                        className="p-2 hover:bg-danger-50 rounded-lg text-secondary-500 hover:text-danger-600 transition-colors"
                        title="Delete contact"
                      >
                        <Icon icon={Icons.trash} width={16} height={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="py-12 text-center">
            <Icon icon={Icons.user} width={48} height={48} className="mx-auto text-secondary-300 mb-3" />
            <p className="text-secondary-500">{t('contacts.no_contacts')}</p>
            <p className="text-sm text-secondary-400 mt-1">
              {t('contacts.no_contacts_desc')}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-theme-primary hover:underline"
              >
                {t('contacts.clear_filters')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Contact Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-surface-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-secondary-900">
                  {isEditMode ? t('contacts.form.edit_title') : t('contacts.form.add_title')}
                </h2>
                <p className="text-sm text-secondary-500 mt-0.5">
                  {isEditMode ? t('contacts.form.edit_desc') : t('contacts.form.add_desc')}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 hover:bg-surface-100 rounded-lg text-secondary-500 transition-colors"
              >
                <Icon icon={Icons.x} width={20} height={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6">
              {/* Avatar Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 mb-3">
                  {t('contacts.form.profile_photo')}
                </label>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-surface-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-surface-300">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Icon icon={Icons.photo} width={40} height={40} className="text-secondary-400" />
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-danger-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove image"
                      >
                        <Icon icon={Icons.x} width={16} height={16} />
                      </button>
                    )}
                  </div>
                  
                  {/* Upload Area */}
                  <div className="flex-1">
                    <label className="block cursor-pointer">
                      <div className="px-4 py-3 border-2 border-dashed border-surface-300 rounded-xl hover:border-theme-primary hover:bg-surface-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-theme-primary-light flex items-center justify-center">
                            <Icon icon={Icons.upload} width={20} height={20} className="text-theme-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-secondary-900">
                              {t('contacts.form.click_upload')}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {t('contacts.form.image_format')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {formErrors.avatar && (
                      <p className="mt-2 text-xs text-danger-500">{formErrors.avatar}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.full_name')} <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.name ? 'border-danger-500' : 'border-surface-200'
                    }`}
                    placeholder={t('contacts.form.enter_full_name')}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.email_address')} <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.email ? 'border-danger-500' : 'border-surface-200'
                    }`}
                    placeholder={t('contacts.form.enter_email')}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.phone_number')} <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.phone ? 'border-danger-500' : 'border-surface-200'
                    }`}
                    placeholder={t('contacts.form.phone_placeholder')}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.location')} <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.location ? 'border-danger-500' : 'border-surface-200'
                    }`}
                    placeholder={t('contacts.form.location_placeholder')}
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.location}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.role')} <span className="text-danger-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.role ? 'border-danger-500' : 'border-surface-200'
                    }`}
                  >
                    <option value="">{t('contacts.form.select_role')}</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>{t(`contacts.role.${role.toLowerCase().replace(/\s+/g, '_')}`)}</option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.role}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.department')} <span className="text-danger-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-surface-50 border rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all ${
                      formErrors.department ? 'border-danger-500' : 'border-surface-200'
                    }`}
                  >
                    <option value="">{t('contacts.form.select_department')}</option>
                    {departments.filter((d) => d !== 'All').map((dept) => (
                      <option key={dept} value={dept}>{t(`contacts.department.${dept.toLowerCase().replace(/\s+/g, '_')}`)}</option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-xs text-danger-500">{formErrors.department}</p>
                  )}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.status')}
                  </label>
                  <div className="flex gap-3">
                    {['active', 'inactive', 'pending'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: status as Contact['status'] })}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          formData.status === status
                            ? status === 'active'
                              ? 'bg-success-100 border-success-300 text-success-700'
                              : status === 'inactive'
                              ? 'bg-secondary-100 border-secondary-300 text-secondary-700'
                              : 'bg-warning-100 border-warning-300 text-warning-700'
                            : 'bg-surface-50 border-surface-200 text-secondary-600 hover:bg-surface-100'
                        }`}
                      >
                        {formData.status === status && (
                          <Icon icon={Icons.check} width={16} height={16} className="inline-block mr-1" />
                        )}
                        <span className="capitalize">{t(`contacts.status.${status}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                    {t('contacts.form.bio')}
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all resize-none"
                    placeholder={t('contacts.form.bio_placeholder')}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-surface-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-surface-100 text-secondary-700 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
                >
                  {t('contacts.form.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {isEditMode ? t('contacts.form.update_contact') : t('contacts.form.add_contact')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {isViewModalOpen && selectedContact && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsViewModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Header with Cover */}
            <div className="h-24 bg-gradient-to-r from-theme-primary to-theme-primary/70 relative">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              >
                <Icon icon={Icons.x} width={20} height={20} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="-mt-12 mb-4 flex items-end gap-4">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
                <button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEdit(selectedContact)
                  }}
                  className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-surface-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors"
                >
                  <Icon icon={Icons.edit} width={16} height={16} />
                  {t('contacts.view.edit')}
                </button>
              </div>

              {/* Name and Role */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-secondary-900">
                    {selectedContact.name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(selectedContact.status)}`}
                  >
                    {t(`contacts.status.${selectedContact.status}`)}
                  </span>
                </div>
                <p className="text-secondary-500">
                  {selectedContact.role} • {selectedContact.department}
                </p>
              </div>

              {/* Bio */}
              <p className="text-sm text-secondary-600 mb-6 leading-relaxed">
                {selectedContact.bio}
              </p>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center">
                    <Icon icon={Icons.mail} width={20} height={20} className="text-theme-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-secondary-500">{t('contacts.view.email')}</p>
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                    <Icon icon={Icons.phone} width={20} height={20} className="text-success-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">{t('contacts.view.phone')}</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                    <Icon icon={Icons.mapPin} width={20} height={20} className="text-warning-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">{t('contacts.view.location')}</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedContact.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-info-100 flex items-center justify-center">
                    <Icon icon={Icons.building} width={20} height={20} className="text-info-600" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">{t('contacts.view.department')}</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedContact.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center gap-6 pt-4 border-t border-surface-200">
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <Icon icon={Icons.calendar} width={16} height={16} />
                  <span>{t('contacts.view.joined')} {new Date(selectedContact.joinedDate).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary-500">
                  <Icon icon={Icons.clock} width={16} height={16} />
                  <span>{t('contacts.view.active')} {selectedContact.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && contactToDelete && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in p-6">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-100 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} width={28} height={28} className="text-danger-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-secondary-900 text-center mb-2">
              {t('contacts.delete.title')}
            </h3>

            {/* Message */}
            <p className="text-sm text-secondary-500 text-center mb-6">
              {t('contacts.delete.message').replace('{name}', contactToDelete.name)}
            </p>

            {/* Contact Preview */}
            <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl mb-6">
              <img
                src={contactToDelete.avatar}
                alt={contactToDelete.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  {contactToDelete.name}
                </p>
                <p className="text-xs text-secondary-500">
                  {contactToDelete.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2.5 bg-surface-100 text-secondary-700 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
              >
                {t('contacts.delete.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-danger-600 text-white rounded-xl text-sm font-medium hover:bg-danger-700 transition-colors"
              >
                {t('contacts.delete.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
