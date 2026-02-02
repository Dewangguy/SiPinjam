<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Enforce that the authenticated user has one of the allowed roles.
     *
     * Usage: middleware('role:admin,approver')
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401);
        }

        $role = $user->role;

        // When role is cast to enum, it may already be a UserRole instance.
        $roleValue = $role instanceof UserRole ? $role->value : (string) $role;

        if (! in_array($roleValue, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
