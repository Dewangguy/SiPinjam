<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Admin Approvals') }}
        </h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                    {{ session('status') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    <ul class="list-disc ms-5">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div class="overflow-x-auto">
                        <table class="min-w-full text-sm">
                            <thead>
                                <tr class="text-left border-b">
                                    <th class="py-2">User</th>
                                    <th class="py-2">Item</th>
                                    <th class="py-2">Mulai</th>
                                    <th class="py-2">Selesai</th>
                                    <th class="py-2">Keperluan</th>
                                    <th class="py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($pendingLoans as $loan)
                                    <tr class="border-b align-top">
                                        <td class="py-2">{{ $loan->user->name }}<div class="text-xs text-gray-500">{{ $loan->user->email }}</div></td>
                                        <td class="py-2">{{ $loan->loanable?->name ?? '-' }}<div class="text-xs text-gray-500">{{ class_basename($loan->loanable_type) }}</div></td>
                                        <td class="py-2">{{ $loan->start_at }}</td>
                                        <td class="py-2">{{ $loan->end_at }}</td>
                                        <td class="py-2">{{ $loan->purpose ?? '-' }}</td>
                                        <td class="py-2">
                                            <div class="flex flex-col gap-2">
                                                <form method="POST" action="{{ route('admin.loans.update', $loan) }}" class="flex items-center gap-2">
                                                    @csrf
                                                    @method('PATCH')
                                                    <input type="hidden" name="status" value="approved">
                                                    <button class="px-3 py-1 bg-green-600 text-white rounded text-xs" type="submit">Approve</button>
                                                </form>

                                                <form method="POST" action="{{ route('admin.loans.update', $loan) }}" class="flex flex-col gap-2">
                                                    @csrf
                                                    @method('PATCH')
                                                    <input type="hidden" name="status" value="rejected">
                                                    <input type="text" name="decision_note" class="border-gray-300 rounded-md shadow-sm text-xs" placeholder="Alasan penolakan (wajib)">
                                                    <button class="px-3 py-1 bg-red-600 text-white rounded text-xs" type="submit">Reject</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="py-6 text-center text-gray-500">Tidak ada pengajuan pending.</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>

                    <div class="mt-4">
                        {{ $pendingLoans->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
