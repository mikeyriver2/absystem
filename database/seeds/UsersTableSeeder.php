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
        $ids_of_eb = [162731,150881,150637,154373,140714,142837,160281,152762,171821,171762,152430,152912];
        $members_json = json_decode(file_get_contents(resource_path('assets\special-jsons\abs_members.json')),true);
        $members_json;
        foreach($members_json as $member){
            $id = join(explode("\r\n",$member['ID #'].PHP_EOL));
            $password = Hash::make($id);
            $email = join(explode("\r\n",$member['E-mail address'].PHP_EOL));
            $name = join(explode("\r\n",$member['Full Name'].PHP_EOL));
            echo "creating account for $id \n";
            User::firstOrCreate([
                'name' => $name,
                'password' => $password,
                'email' => $email,
                'type' => in_array($id,$ids_of_eb) ? "eb" : null
            ]);
        }

    }
}
