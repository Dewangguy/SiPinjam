<?php

namespace App\Http\Requests;

use App\Models\Asset;
use App\Models\Loan;
use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLoanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'kind' => ['required', 'string', Rule::in(['room', 'asset'])],
            'loanable_id' => ['required', 'integer', 'min:1'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'purpose' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $kind = $this->input('kind');
            $loanableId = (int) $this->input('loanable_id');
            $startAt = $this->date('start_at');
            $endAt = $this->date('end_at');

            $loanableClass = match ($kind) {
                'room' => Room::class,
                'asset' => Asset::class,
                default => null,
            };

            if (!$loanableClass || !$loanableClass::whereKey($loanableId)->exists()) {
                $validator->errors()->add('loanable_id', 'Item yang dipilih tidak valid.');
                return;
            }

            $hasConflict = Loan::query()
                ->blocking()
                ->where('loanable_type', $loanableClass)
                ->where('loanable_id', $loanableId)
                ->overlapping($startAt, $endAt)
                ->exists();

            if ($hasConflict) {
                $validator->errors()->add('start_at', 'Jadwal bentrok: item tersebut sudah dibooking pada rentang waktu itu.');
            }
        });
    }
}
