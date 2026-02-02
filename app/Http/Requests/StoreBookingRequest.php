<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
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
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'asset_ids' => ['required', 'array', 'min:1'],
            'asset_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('assets', 'id')->where(function ($q) {
                    $q->where('is_active', true)->where('status', 'available');
                }),
            ],
        ];
    }
}
