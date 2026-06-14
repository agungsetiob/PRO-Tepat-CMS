<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Scenario;
use App\Models\Honorific;
use App\Models\Protocol;
use App\Models\Tag;
use Faker\Factory as Faker;

class ProtocolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // -------------------------------------------------------------
        // 1. MASTER SEEDER: CATEGORIES
        // -------------------------------------------------------------
        $categoriesData = [
            [
                'name' => 'Tata Tempat',
                'slug' => 'tata-tempat',
                'icon' => 'castle', // Menggunakan Lucide Icon 'castle'
                'type' => 'tempat',
                'order' => 1
            ],
            [
                'name' => 'Tata Acara',
                'slug' => 'tata-acara',
                'icon' => 'calendar-days', // Menggunakan Lucide Icon
                'type' => 'acara',
                'order' => 2
            ],
            [
                'name' => 'Tata Penghormatan',
                'slug' => 'tata-penghormatan',
                'icon' => 'award', // Menggunakan Lucide Icon
                'type' => 'hormat',
                'order' => 3
            ],
        ];

        foreach ($categoriesData as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $catTempat = Category::where('type', 'tempat')->first();
        $catAcara = Category::where('type', 'acara')->first();
        $catHormat = Category::where('type', 'hormat')->first();

        // -------------------------------------------------------------
        // 2. MASTER SEEDER: HONORIFICS (Kamus Saku Protokol)
        // -------------------------------------------------------------
        $honorificsData = [
            ['jabatan' => 'Presiden RI', 'sapaan_resmi' => 'Yang Mulia', 'sapaan_lisan' => 'Bapak Presiden', 'perlakuan_khusus' => 'Pengawalan Paspampres Grup A, Penyediaan Ruang Transit VVIP utama.', 'tingkat' => 1],
            ['jabatan' => 'Wakil Presiden RI', 'sapaan_resmi' => 'Yang Mulia', 'sapaan_lisan' => 'Bapak Wakil Presiden', 'perlakuan_khusus' => 'Pengawalan Paspampres Grup B, Ruang Transit VVIP.', 'tingkat' => 2],
            ['jabatan' => 'Gubernur Kalimantan Selatan', 'sapaan_resmi' => 'Yang Terhormat', 'sapaan_lisan' => 'Bapak Gubernur', 'perlakuan_khusus' => 'Penyambutan oleh Kepala Daerah, Jajaran Kehormatan Satpol PP.', 'tingkat' => 3],
            ['jabatan' => 'Bupati Tanah Bumbu', 'sapaan_resmi' => 'Yang Terhormat', 'sapaan_lisan' => 'Bapak Bupati', 'perlakuan_khusus' => 'Tuan rumah utama (Preseance Utama Lokal), Protokol Protokoler RI-1/Provinsi penyesuaian.', 'tingkat' => 4],
            ['jabatan' => 'Wakil Bupati Tanah Bumbu', 'sapaan_resmi' => 'Yang Terhormat', 'sapaan_lisan' => 'Bapak Wakil Bupati', 'perlakuan_khusus' => 'Pendamping utama Kepala Daerah.', 'tingkat' => 5],
            ['jabatan' => 'Ketua DPRD Kabupaten Tanah Bumbu', 'sapaan_resmi' => 'Yang Terhormat', 'sapaan_lisan' => 'Bapak Ketua DPRD', 'perlakuan_khusus' => 'Ditempatkan sejajar unsur Forkopimda pada jajaran utama.', 'tingkat' => 6],
            ['jabatan' => 'Sekretaris Daerah (Sekda) Tanbu', 'sapaan_resmi' => 'Yang Kami Hormati', 'sapaan_lisan' => 'Bapak Sekda', 'perlakuan_khusus' => 'Pendamping teknis urutan administrasi tertinggi ASN.', 'tingkat' => 7],
            ['jabatan' => 'Kepala Dinas / Badan Pemkab Tanbu', 'sapaan_resmi' => 'Yang Kami Hormati', 'sapaan_lisan' => 'Bapak/Ibu Kepala Dinas', 'perlakuan_khusus' => 'Penempatan sesuai eselonering (Eselon II).', 'tingkat' => 8],
        ];

        foreach ($honorificsData as $hon) {
            Honorific::updateOrCreate(['jabatan' => $hon['jabatan']], $hon);
        }

        // Ambil ID untuk penugasan seating rules
        $honorificIds = Honorific::pluck('id')->toArray();

        // -------------------------------------------------------------
        // 3. MASTER SEEDER: TAGS
        // -------------------------------------------------------------
        $tagsData = ['Mobil Dinas', 'Upacara', 'Rapat Koordinasi', 'VIP', 'Bupati', 'Wabup', 'Pelantikan', 'Audiensi'];
        $tagModels = [];
        foreach ($tagsData as $tagName) {
            $tagModels[] = Tag::updateOrCreate(
                ['slug' => Str::slug($tagName)],
                ['name' => $tagName, 'slug' => Str::slug($tagName)]
            );
        }

        // -------------------------------------------------------------
        // 4. MASSIVE SEEDER GENERATOR: SCENARIOS (Bikin Banyak untuk Uji Load More)
        // -------------------------------------------------------------
        
        // --- DATA CONTEXTUAL REAL UTAMA ---
        $realScenarios = [
            [
                'category_id' => $catTempat->id,
                'title' => 'Tata Tempat Duduk Kendaraan Dinas Bupati (Pajero Sport/Sedan)',
                'layout_type' => 'mobil',
                'jenis_acara' => 'resmi',
                'description' => 'Pedoman penempatan posisi duduk VIP, ajudan, dan sopir pada kendaraan dinas operasional Pemkab Tanah Bumbu berdasarkan asas kesetaraan.'
            ],
            [
                'category_id' => $catAcara->id,
                'title' => 'Upacara Hari Jadi Kabupaten Tanah Bumbu di Halaman Kantor Bupati',
                'layout_type' => 'panggung',
                'jenis_acara' => 'kenegaraan',
                'description' => 'Susunan urutan susunan upacara sakral tahunan peringatan HUT Kabupaten Tanah Bumbu, mencakup perwira upacara dan komandan.'
            ],
            [
                'category_id' => $catHormat->id,
                'title' => 'Tata Penghormatan dan Transit Kunjungan Kerja Gubernur Kalsel',
                'layout_type' => 'roundtable',
                'jenis_acara' => 'resmi',
                'description' => 'Pedoman penyambutan resmi, jajaran jabat tangan, kalung bunga, hingga penempatan di ruang transit VVIP RSUD / Kantor Bupati.'
            ],
        ];

        foreach ($realScenarios as $index => $rs) {
            $rs['slug'] = Str::slug($rs['title']);
            $rs['order'] = $index + 1;
            $scen = Scenario::create($rs);
            $this->seedChildrenData($scen, $honorificIds, $faker);
            
            // Pasang Polymorphic Tags
            $scen->tags()->attach([$tagModels[0]->id, $tagModels[3]->id]);
        }

        // --- LOOP DUMMY DATA GENERATOR (Buat 50 data tambahan agar terasa berat saat scroll app mobile) ---
        $layoutTypes = ['teater', 'roundtable', 'panggung', 'mobil'];
        $jenisAcaraOpts = ['kenegaraan', 'resmi', 'incognito'];
        
        for ($i = 1; $i <= 50; $i++) {
            // Tentukan kategori secara acak
            $chosenCat = $faker->randomElement([$catTempat, $catAcara, $catHormat]);
            
            $title = $faker->unique()->randomElement([
                "Rapat Paripurna DPRD Tanbu Agenda Ke-$i",
                "Pelantikan Pejabat Eselon III & IV Gelombang $i",
                "MoU Kesepakatan Bersama Pemkab Tanbu dengan Universitas PTN $i",
                "Penyambutan Kunjungan Kerja Spesifik Komisi DPR RI ke-$i",
                "Tata Tempat Roundtable Pembukaan Musrenbang Kabupaten Ke-$i",
                "Upacara Peringatan Hari Besar Nasional Sektor Tanbu Seri $i",
                "Pemberian Penghargaan Lomba Kebersihan SKPD Tanbu Ke-$i",
                "Audiensi Instansi Vertikal dengan Bupati Tanah Bumbu Bagian $i"
            ]) . " Tahun 2026";

            $scen = Scenario::create([
                'category_id' => $chosenCat->id,
                'title' => $title,
                'slug' => Str::slug($title),
                'description' => "Ini adalah data pedoman simulasi otomatis ke-$i untuk pengujian beban query API pagination mobile app PROTAP Kabupaten Tanah Bumbu.",
                'thumbnail' => null,
                'layout_type' => $faker->randomElement($layoutTypes),
                'jenis_acara' => $faker->randomElement($jenisAcaraOpts),
                'order' => $i + 10,
                'is_active' => true,
            ]);

            // Seeding anak-anak relasinya
            $this->seedChildrenData($scen, $honorificIds, $faker);

            // Pasang random tags
            $randomTagIds = collect($tagModels)->pluck('id')->random(2)->toArray();
            $scen->tags()->attach($randomTagIds);
        }
    }

    /**
     * Helper privat untuk mengisi relasi anak sub-table secara otomatis
     */
    // private function seedChildrenData($scenario, $honorificIds, $faker)
    // {
    //     // 1. Buat Sub-table: Protocols
    //     for ($p = 1; $p <= $faker->numberBetween(1, 2); $p++) {
    //         $protocol = Protocol::create([
    //             'scenario_id' => $scenario->id,
    //             'title' => "Bab $p: Pedoman Teknis " . $faker->words(3, true),
    //             'content' => "Menimbang Ketentuan Protokoler Negara, Aturan Preseance nomor urut kedudukan pejabat daerah didasarkan atas UU Nomor 9 Tahun 2010. Pihak Protokol Pemkab wajib menata susunan ini demi kelancaran.",
    //             'image_infographic' => null,
    //             'references' => json_encode(["Pasal " . $faker->numberBetween(1, 40) . " Perbup Tanah Bumbu No " . $faker->numberBetween(2018, 2026)]),
    //             'order' => $p,
    //         ]);

    //         // Jika tipenya tata tempat, isi seating_rules
    //         if ($scenario->category->type === 'tempat') {
    //             $labels = ['Utama Tengah', 'Sayap Kanan (Urutan 2)', 'Sayap Kiri (Urutan 3)', 'Urutan Belakang'];
    //             foreach ($labels as $idx => $label) {
    //                 DB::table('seating_rules')->insert([
    //                     'protocol_id' => $protocol->id,
    //                     'position_label' => $label,
    //                     'honorific_id' => $faker->randomElement($honorificIds),
    //                     'note' => 'Aturan posisi pengaturan nomor ke-' . ($idx + 1),
    //                     'order' => $idx + 1,
    //                     'created_at' => now(),
    //                     'updated_at' => now(),
    //                 ]);
    //             }
    //         }
    //     }

    //     // 2. Buat Sub-table: Event Checklists
    //     $sections = ['Acara Persiapan', 'Acara Pokok', 'Acara Penutup'];
    //     foreach ($sections as $secIdx => $section) {
    //         for ($c = 1; $c <= 3; $c++) {
    //             DB::table('event_checklists')->insert([
    //                 'scenario_id' => $scenario->id,
    //                 'section' => $section,
    //                 'item' => "Poin Agenda: " . $faker->sentence(4),
    //                 'order' => ($secIdx * 10) + $c,
    //                 'created_at' => now(),
    //                 'updated_at' => now(),
    //             ]);
    //         }
    //     }

    //     // 3. Buat Sub-table: Event Equipment
    //     $equipments = [
    //         ['name' => 'Podium Utama Lambang Daerah', 'category' => 'kelengkapan'],
    //         ['name' => 'Bendera Merah Putih & Pataka', 'category' => 'kelengkapan'],
    //         ['name' => 'Sound System Wireless 2000 Watt', 'category' => 'perlengkapan'],
    //         ['name' => 'Kursi Gilded VIP Jati', 'category' => 'perlengkapan'],
    //     ];

    //     foreach ($equipments as $eq) {
    //         DB::table('event_equipment')->insert([
    //             'scenario_id' => $scenario->id,
    //             'name' => $eq['name'],
    //             'category' => $eq['category'],
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);
    //     }
    // }
    /**
     * Helper privat untuk mengisi relasi anak sub-table secara otomatis
     */
    private function seedChildrenData($scenario, $honorificIds, $faker)
    {
        // 1. Buat Sub-table: Protocols (Diubah menjadi TEPAT 1 Protokol per Skenario)
        $protocol = Protocol::create([
            'scenario_id' => $scenario->id,
            'title' => "Pedoman Teknis Utama " . $faker->words(3, true),
            'content' => "Menimbang Ketentuan Protokoler Negara, Aturan Preseance nomor urut kedudukan pejabat daerah didasarkan atas UU Nomor 9 Tahun 2010. Pihak Protokol Pemkab wajib menata susunan ini demi kelancaran.",
            'image_infographic' => null,
            'references' => json_encode(["Pasal " . $faker->numberBetween(1, 40) . " Perbup Tanah Bumbu No " . $faker->numberBetween(2018, 2026)]),
            'order' => 1,
        ]);

        // Jika tipenya tata tempat, isi seating_rules menggunakan $protocol yang baru dibuat
        if ($scenario->category->type === 'tempat') {
            $labels = ['Utama Tengah', 'Sayap Kanan (Urutan 2)', 'Sayap Kiri (Urutan 3)', 'Urutan Belakang'];
            foreach ($labels as $idx => $label) {
                DB::table('seating_rules')->insert([
                    'protocol_id' => $protocol->id,
                    'position_label' => $label,
                    'honorific_id' => $faker->randomElement($honorificIds),
                    'note' => 'Aturan posisi pengaturan nomor ke-' . ($idx + 1),
                    'order' => $idx + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 2. Buat Sub-table: Event Checklists
        $sections = ['Acara Persiapan', 'Acara Pokok', 'Acara Penutup'];
        foreach ($sections as $secIdx => $section) {
            for ($c = 1; $c <= 3; $c++) {
                DB::table('event_checklists')->insert([
                    'scenario_id' => $scenario->id,
                    'section' => $section,
                    'item' => "Poin Agenda: " . $faker->sentence(4),
                    'order' => ($secIdx * 10) + $c,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 3. Buat Sub-table: Event Equipment
        $equipments = [
            ['name' => 'Podium Utama Lambang Daerah', 'category' => 'kelengkapan'],
            ['name' => 'Bendera Merah Putih & Pataka', 'category' => 'kelengkapan'],
            ['name' => 'Sound System Wireless 2000 Watt', 'category' => 'perlengkapan'],
            ['name' => 'Kursi Gilded VIP Jati', 'category' => 'perlengkapan'],
        ];

        foreach ($equipments as $eq) {
            DB::table('event_equipment')->insert([
                'scenario_id' => $scenario->id,
                'name' => $eq['name'],
                'category' => $eq['category'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}