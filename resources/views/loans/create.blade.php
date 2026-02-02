<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Ajukan Peminjaman') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900" x-data="{ kind: 'room' }">
                    @if ($errors->any())
                        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                            <ul class="list-disc ms-5">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <form method="POST" action="{{ route('loans.store') }}" class="space-y-4">
                        @csrf

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Jenis</label>
                            <select name="kind" class="mt-1 border-gray-300 rounded-md shadow-sm" x-model="kind">
                                <option value="room">Ruangan</option>
                                <option value="asset">Aset</option>
                            </select>
                        </div>

                        <div x-show="kind === 'room'">
                            <label class="block text-sm font-medium text-gray-700">Ruangan</label>
                            <select name="loanable_id" class="mt-1 border-gray-300 rounded-md shadow-sm w-full">
                                @foreach ($rooms as $room)
                                    <option value="{{ $room->id }}">{{ $room->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div x-show="kind === 'asset'">
                            <label class="block text-sm font-medium text-gray-700">Aset</label>
                            <select name="loanable_id" class="mt-1 border-gray-300 rounded-md shadow-sm w-full">
                                @foreach ($assets as $asset)
                                    <option value="{{ $asset->id }}">{{ $asset->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Mulai</label>
                                <input type="datetime-local" name="start_at" class="mt-1 border-gray-300 rounded-md shadow-sm w-full" value="{{ old('start_at', $prefillStart) }}" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Selesai</label>
                                <input type="datetime-local" name="end_at" class="mt-1 border-gray-300 rounded-md shadow-sm w-full" value="{{ old('end_at', $prefillEnd) }}" required>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Keperluan (opsional)</label>
                            <input type="text" name="purpose" class="mt-1 border-gray-300 rounded-md shadow-sm w-full" value="{{ old('purpose') }}" placeholder="Contoh: Rapat koordinasi">
                        </div>

                        <div class="flex items-center justify-end gap-3">
                            <a href="{{ route('loans.index') }}" class="text-sm text-gray-600 hover:underline">Kembali</a>
                            <button type="submit" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                                Kirim Pengajuan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
