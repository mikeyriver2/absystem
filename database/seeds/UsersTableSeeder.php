<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for($i = 0; $i < 5; $i++){
            echo "Generating User";
            $username = "abs-user-".$i."@gmail.com";
            $password = Hash::make($username);
            User::create([
                'email' => $username,
                'password' => $password
            ]);
        }
    }
}
