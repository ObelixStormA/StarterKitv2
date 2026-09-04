<?php

namespace App\Http\Controllers;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Generate a new (unconfirmed) secret and return the QR code + manual key.
     */
    public function store(Request $request): JsonResponse
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $request->user()->forceFill([
            'two_factor_secret' => Crypt::encryptString($secret),
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $request->user()->email,
            $secret,
        );

        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd(),
        );

        $svg = (new Writer($renderer))->writeString($qrCodeUrl);

        return response()->json([
            'svg' => $svg,
            'secret' => $secret,
        ]);
    }

    /**
     * Confirm the secret with a code from the authenticator app and enable 2FA.
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $user = $request->user();
        $google2fa = new Google2FA();

        $valid = $user->two_factor_secret && $google2fa->verifyKey(
            Crypt::decryptString($user->two_factor_secret),
            $request->code,
        );

        if (! $valid) {
            return back()->withErrors(['code' => "Kod noto'g'ri. Qaytadan urinib ko'ring."]);
        }

        $recoveryCodes = collect(range(1, 8))
            ->map(fn () => Str::random(10) . '-' . Str::random(10))
            ->all();

        $user->forceFill([
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
            'two_factor_confirmed_at' => now(),
        ])->save();

        return back()->with('success', 'Ikki bosqichli autentifikatsiya yoqildi')
            ->with('recovery_codes', $recoveryCodes);
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back()->with('success', "Ikki bosqichli autentifikatsiya o'chirildi");
    }
}
