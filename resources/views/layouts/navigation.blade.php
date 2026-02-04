<aside class="hidden w-72 border-r border-gray-100 bg-white lg:block" aria-label="Sidebar">
    <div class="flex h-full flex-col">
        <div class="flex items-center gap-3 px-4 py-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8M8 15h5" />
                </svg>
            </div>
            <div class="min-w-0">
                <div class="truncate text-sm font-bold tracking-tight text-gray-900">SiPinjam</div>
                <div class="truncate text-xs font-medium text-gray-500">RFMS-style UI</div>
            </div>
        </div>

        <div class="px-3">
            <div class="space-y-1">
                <a
                    href="{{ route('dashboard') }}"
                    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('dashboard') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                >
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('dashboard') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate">Dashboard</div>
                    </div>
                </a>

                <a
                    href="{{ route('bookings.index') }}"
                    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('bookings.*') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                >
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('bookings.*') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h13M8 12h13M8 17h13M3 7h.01M3 12h.01M3 17h.01" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate">Bookings</div>
                        <div class="truncate text-xs font-medium text-gray-500">Peminjaman</div>
                    </div>
                </a>

                <a
                    href="{{ route('calendar.index') }}"
                    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('calendar.*') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                >
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('calendar.*') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate">Calendar</div>
                        <div class="truncate text-xs font-medium text-gray-500">Jadwal & ketersediaan</div>
                    </div>
                </a>

                @if(auth()->user()?->isAdmin() || auth()->user()?->isApprover())
                    <a
                        href="{{ route('admin.assets.index') }}"
                        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('admin.assets.*') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                    >
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('admin.assets.*') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <div class="truncate">Inventory</div>
                            <div class="truncate text-xs font-medium text-gray-500">Ruangan & fasilitas</div>
                        </div>
                    </a>

                    <a
                        href="{{ route('admin.bookings.index') }}"
                        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('admin.bookings.*') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                    >
                        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('admin.bookings.*') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <div class="truncate">Approvals</div>
                            <div class="truncate text-xs font-medium text-gray-500">Persetujuan</div>
                        </div>
                    </a>
                @endif

                <a
                    href="{{ route('profile.edit') }}"
                    class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition {{ request()->routeIs('profile.*') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50' }}"
                >
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-gray-100">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 {{ request()->routeIs('profile.*') ? 'text-emerald-700' : 'text-gray-400 group-hover:text-gray-600' }}">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate">Settings</div>
                        <div class="truncate text-xs font-medium text-gray-500">Profil akun</div>
                    </div>
                </a>
            </div>
        </div>

        <div class="mt-auto px-3 pb-4">
            <div class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-gray-700">
                Sidebar
            </div>
        </div>
    </div>
</aside>
