<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\OAuthProvider;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

class SocialAuthController extends Controller
{
    protected array $providers = ['github', 'google'];

    public function redirect(string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, $this->providers, true), 404);

        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        abort_unless(in_array($provider, $this->providers, true), 404);

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Throwable $e) {
            Log::error("OAuth {$provider} callback failed: {$e->getMessage()}", ['exception' => $e]);

            return redirect()->route('login')->with('error', "{$provider} orqali kirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
        }

        $link = OAuthProvider::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        $user = $link?->user;

        if (! $user) {
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                $user->oauthProviders()->create([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                $user = $this->createUser($provider, $socialUser);
            }
        }

        Auth::login($user, remember: true);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    protected function createUser(string $provider, SocialiteUser $socialUser): User
    {
        $user = User::create([
            'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: 'User',
            'email' => $socialUser->getEmail(),
            'password' => Hash::make(Str::random(32)),
            'email_verified_at' => now(),
        ]);

        $user->assignRole('user');

        $user->oauthProviders()->create([
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
        ]);

        event(new Registered($user));

        return $user;
    }
}
