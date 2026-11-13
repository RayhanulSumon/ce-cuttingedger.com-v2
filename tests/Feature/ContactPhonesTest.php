<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactPhonesTest extends TestCase
{
    use RefreshDatabase;

    public function test_parses_one_phone_per_line_and_skips_incomplete_lines(): void
    {
        $phones = Setting::parsePhones("BD | +88 02 0000 0000\n\nUAE|+971 00 000 0000\nbroken line\nUSA | ");

        $this->assertSame([
            ['label' => 'BD', 'number' => '+88 02 0000 0000'],
            ['label' => 'UAE', 'number' => '+971 00 000 0000'],
        ], $phones);
    }

    public function test_admin_phone_setting_is_shared_with_every_page(): void
    {
        Setting::create(['key' => 'contact_phones', 'value' => "BD | +88 02 0000 0000\nUSA | +1 000 000 0000"]);

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->has('settings.contact_phones', 2)
            ->where('settings.contact_phones.0.label', 'BD')
            ->where('settings.contact_phone', '+88 02 0000 0000')
        );
    }

    public function test_whatsapp_number_is_shared_and_empty_by_default(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('settings.whatsapp_number', ''));

        Setting::create(['key' => 'whatsapp_number', 'value' => '8801700000000']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('settings.whatsapp_number', '8801700000000'));
    }
}
