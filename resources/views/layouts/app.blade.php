<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        @stack('styles')
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-50">
            <div class="flex min-h-screen">
                @include('layouts.navigation')

                <div class="flex min-w-0 flex-1 flex-col">
                    <header class="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur">
                        <div class="flex items-center gap-3 px-4 py-3 lg:px-6">
                            <div class="relative flex-1">
                                <div class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search rooms, bookings, or facilities..."
                                    class="w-full rounded-xl border border-gray-200 bg-white px-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <button type="button" class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5 text-gray-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0" />
                                </svg>
                                <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <div class="flex items-center gap-3 rounded-xl px-2.5 py-1.5">
                                <div class="hidden text-right sm:block">
                                    <div class="max-w-[200px] truncate text-sm font-semibold text-gray-900">{{ Auth::user()->name }}</div>
                                    <div class="text-xs font-medium text-gray-500">
                                        {{ Auth::user()->role === 'admin' ? 'Administrator' : (Auth::user()->role === 'approver' ? 'Approver' : 'User') }}
                                    </div>
                                </div>

                                <x-dropdown align="right" width="56">
                                    <x-slot name="trigger">
                                        <button class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                                            {{ strtoupper(substr(Auth::user()->name, 0, 2)) }}
                                        </button>
                                    </x-slot>

                                    <x-slot name="content">
                                        <div class="px-4 py-3">
                                            <div class="text-xs text-gray-500">Signed in as</div>
                                            <div class="truncate text-sm font-semibold text-gray-900">{{ Auth::user()->email }}</div>
                                        </div>
                                        <div class="border-t border-gray-100"></div>

                                        <x-dropdown-link :href="route('profile.edit')">
                                            {{ __('Profile') }}
                                        </x-dropdown-link>

                                        <form method="POST" action="{{ route('logout') }}">
                                            @csrf
                                            <x-dropdown-link :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();">
                                                {{ __('Log Out') }}
                                            </x-dropdown-link>
                                        </form>
                                    </x-slot>
                                </x-dropdown>
                            </div>
                        </div>
                    </header>

                    <main class="flex-1 px-4 py-6 lg:px-6">
                        @isset($header)
                            <div class="mb-6">
                                {{ $header }}
                            </div>
                        @endisset

                        {{ $slot }}
                    </main>
                </div>
            </div>
        </div>

        @stack('scripts')
    </body>
</html>
