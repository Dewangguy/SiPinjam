<x-app-layout>
    @push('scripts')
        @if ($loans->getCollection()->where('status', 'pending')->count() > 0)
            <script>
                setInterval(() => window.location.reload(), 30000);
            </script>
        @endif
    @endpush

    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('My Loans') }}
            </h2>
            <a href="{{ route('loans.create') }}" class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700">
                Ajukan
            </a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                    {{ session('status') }}
                </div>
            @endif

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead>
                                <tr class="text-left border-b">
                                    <th class="py-2">Item</th>
                                    <th class="py-2">Mulai</th>
                                    <th class="py-2">Selesai</th>
                                    <th class="py-2">Status</th>
                                    <th class="py-2">Catatan</th>
                                    <th class="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($loans as $loan)
                                    <tr class="border-b">
                                        <td class="py-2">
                                            {{ $loan->loanable?->name ?? '-' }}
                                            <div class="text-xs text-gray-500">{{ class_basename($loan->loanable_type) }}</div>
                                        </td>
                                        <td class="py-2">{{ $loan->start_at }}</td>
                                        <td class="py-2">{{ $loan->end_at }}</td>
                                        <td class="py-2">
                                            <span class="px-2 py-1 rounded text-xs
                                                @if ($loan->status === 'approved') bg-green-100 text-green-800
                                                @elseif ($loan->status === 'pending') bg-amber-100 text-amber-800
                                                @elseif ($loan->status === 'rejected') bg-red-100 text-red-800
                                                @else bg-gray-100 text-gray-800 @endif
                                            ">
                                                {{ strtoupper($loan->status) }}
                                            </span>
                                        </td>
                                        <td class="py-2">
                                            {{ $loan->decision_note ?? '-' }}
                                        </td>
                                        <td class="py-2 text-right">
                                            @if ($loan->status === 'pending')
                                                <form method="POST" action="{{ route('loans.cancel', $loan) }}">
                                                    @csrf
                                                    <button class="text-sm text-red-600 hover:underline" type="submit">Batalkan</button>
                                                </form>
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="py-6 text-center text-gray-500">Belum ada riwayat peminjaman.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4">
                        {{ $loans->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
