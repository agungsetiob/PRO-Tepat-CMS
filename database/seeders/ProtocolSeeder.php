<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category; use App\Models\Scenario; use App\Models\Protocol; use App\Models\SeatingRule; use App\Models\EventChecklist;

class ProtocolSeeder extends Seeder {
    public function run(): void {
        $tataTempat = Category::create(['name' => 'TATA TEMPAT', 'slug' => 'tata-tempat', 'type' => 'tempat', 'order' => 1]);
        $tataAcara = Category::create(['name' => 'TATA ACARA', 'slug' => 'tata-acara', 'type' => 'acara', 'order' => 2]);

        $berjajar = Scenario::create([
            'category_id' => $tataTempat->id,
            'title' => 'Tata Tempat Berjajar',
            'slug' => 'berjajar',
            'description' => 'Pedoman umum posisi duduk berjajar sesuai UU'
        ]);

        $protocol = Protocol::create([
            'scenario_id' => $berjajar->id,
            'title' => 'Pedoman Umum',
            'content' => 'Jika berjajar, yang berada di sebelah kanan dari orang yang mendapat urutan tata tempat paling utama, dianggap lebih tinggi/mendahului orang yang duduk disebelah kirinya', //【321215424688596751721†L7-L10】
            'references' => ['Undang-Undang No 9 Tahun 2010']
        ]);

        SeatingRule::create(['protocol_id' => $protocol->id, 'position_label' => 'Genap', 'jabatan' => 'Rumus', 'note' => '4 - 2 - 1 - 3', 'order' => 1]); //【321215424688596751721†L22-L22】
        SeatingRule::create(['protocol_id' => $protocol->id, 'position_label' => 'Ganjil', 'jabatan' => 'Rumus', 'note' => '3 - 1 - 2', 'order' => 2]); //【321215424688596751721†L22-L22】

        $upacara = Scenario::create([
            'category_id' => $tataAcara->id,
            'title' => 'Upacara Bendera',
            'slug' => 'upacara-bendera',
            'jenis_acara' => 'resmi'
        ]);

        EventChecklist::create(['scenario_id' => $upacara->id, 'section' => 'Acara Pokok', 'item' => 'Laporan Komandan Upacara', 'order' => 1]); //【360500804963495877205†L19-L19】
        EventChecklist::create(['scenario_id' => $upacara->id, 'section' => 'Acara Pokok', 'item' => 'Pengibaran Bendera Negara', 'order' => 2]); //【360500804963495877205†L20-L20】
        EventChecklist::create(['scenario_id' => $upacara->id, 'section' => 'Acara Pokok', 'item' => 'Mengheningkan Cipta', 'order' => 3]); //【360500804963495877205†L21-L21】
    }
}