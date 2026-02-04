<x-app-layout>
    @push('styles')
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.20/index.global.min.css">
    @endpush

    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Availability Calendar') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900" x-data="{ kind: '' }">
                    <div class="flex flex-col md:flex-row gap-4 md:items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Jenis</label>
                            <select id="calendar-kind" class="mt-1 border-gray-300 rounded-md shadow-sm" x-model="kind">
                                <option value="">Semua</option>
                                <option value="room">Ruangan</option>
                                <option value="asset">Aset</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Item (opsional)</label>
                            <select id="calendar-room-id" class="mt-1 border-gray-300 rounded-md shadow-sm" x-show="kind === 'room'">
                                <option value="">Semua Ruangan</option>
                                @foreach ($rooms as $room)
                                    <option value="{{ $room->id }}">{{ $room->name }}</option>
                                @endforeach
                            </select>

                            <select id="calendar-asset-id" class="mt-1 border-gray-300 rounded-md shadow-sm" x-show="kind === 'asset'">
                                <option value="">Semua Aset</option>
                                @foreach ($assets as $asset)
                                    <option value="{{ $asset->id }}">{{ $asset->name }}</option>
                                @endforeach
                            </select>

                            <div class="mt-1 text-xs text-gray-500" x-show="kind === ''">Pilih jenis agar bisa filter per item.</div>
                            <p class="mt-1 text-xs text-gray-500">Tip: pilih jenis + item agar kalender fokus.</p>
                        </div>

                        <div class="md:ms-auto">
                            <a href="{{ route('loans.create') }}" class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">
                                Ajukan Peminjaman
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <div
                        id="loan-calendar"
                        data-events-url="{{ route('calendar.events') }}"
                        data-create-url="{{ route('loans.create') }}"
                    ></div>
                    <p class="mt-3 text-xs text-gray-500">Klik-drag pada kalender untuk prefill form pengajuan.</p>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
