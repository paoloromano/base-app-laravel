<?php

namespace Tests;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * I ruoli non nascono dalle migration: senza seed la registrazione fallisce
     * con RoleDoesNotExist, perché il controller assegna 'user' all'iscrizione.
     * Vale per ogni test che usa RefreshDatabase.
     */
    protected $seed = true;

    protected $seeder = RoleSeeder::class;
}
