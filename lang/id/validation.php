<?php

return [
    'accepted'             => 'Kolom :attribute harus diterima.',
    'active_url'           => 'Kolom :attribute bukan URL yang valid.',
    'after'                => 'Kolom :attribute harus tanggal setelah :date.',
    'alpha'                => 'Kolom :attribute hanya boleh berisi huruf.',
    'alpha_dash'           => 'Kolom :attribute hanya boleh berisi huruf, angka, strip, dan garis bawah.',
    'alpha_num'            => 'Kolom :attribute hanya boleh berisi huruf dan angka.',
    'array'                => 'Kolom :attribute harus berupa array.',
    'before'               => 'Kolom :attribute harus tanggal sebelum :date.',

    'between'              => [
        'numeric' => 'Kolom :attribute harus antara :min dan :max.',
        'file'    => 'Kolom :attribute harus antara :min dan :max kilobytes.',
        'string'  => 'Kolom :attribute harus antara :min dan :max karakter.',
        'array'   => 'Kolom :attribute harus memiliki antara :min dan :max item.',
    ],

    'boolean'              => 'Kolom :attribute harus bernilai true atau false.',
    'confirmed'            => 'Konfirmasi kolom :attribute tidak cocok.',
    'date'                 => 'Kolom :attribute bukan tanggal yang valid.',
    'date_format'          => 'Kolom :attribute tidak cocok dengan format :format.',
    'different'            => 'Kolom :attribute dan :other harus berbeda.',
    'digits'               => 'Kolom :attribute harus berupa angka :digits digit.',
    'digits_between'       => 'Kolom :attribute harus antara :min dan :max digit.',

    'email'                => 'Kolom :attribute harus berupa alamat email yang valid.',
    'exists'               => 'Kolom :attribute tidak ditemukan dalam data referensi.',
    'image'                => 'Kolom :attribute harus berupa gambar.',
    'in'                   => 'Kolom :attribute yang dipilih tidak valid.',

    'integer'              => 'Kolom :attribute harus berupa bilangan bulat.',
    'ip'                   => 'Kolom :attribute harus berupa alamat IP yang valid.',

    'max'                  => [
        'numeric' => 'Kolom :attribute tidak boleh lebih dari :max.',
        'file'    => 'Kolom :attribute tidak boleh lebih dari :max kilobytes.',
        'string'  => 'Kolom :attribute tidak boleh lebih dari :max karakter.',
        'array'   => 'Kolom :attribute tidak boleh lebih dari :max item.',
    ],

    'min'                  => [
        'numeric' => 'Kolom :attribute minimal :min.',
        'file'    => 'Kolom :attribute minimal :min kilobytes.',
        'string'  => 'Kolom :attribute minimal :min karakter.',
        'array'   => 'Kolom :attribute minimal memiliki :min item.',
    ],

    'not_in'               => 'Kolom :attribute yang dipilih tidak valid.',
    'numeric'              => 'Kolom :attribute harus berupa angka.',

    'required'             => 'Kolom :attribute wajib diisi.',
    'same'                 => 'Kolom :attribute dan :other harus sama.',

    'size'                 => [
        'numeric' => 'Kolom :attribute harus berukuran :size.',
        'file'    => 'Kolom :attribute harus berukuran :size kilobytes.',
        'string'  => 'Kolom :attribute harus berukuran :size karakter.',
        'array'   => 'Kolom :attribute harus berisi :size item.',
    ],

    'auth'                 => [
        'failed' => 'Kredensial ini tidak cocok dengan data kami',
    ],

    'string'               => 'Kolom :attribute harus berupa string.',
    'unique'               => 'Kolom :attribute sudah digunakan.',
    'url'                  => 'Format kolom :attribute tidak valid.',

    // ============================================
    // VALIDASI KHUSUS UNTUK STORE RUNDOWN
    // ============================================
    'items.0.master_agenda_id.required' => 'Urutan ke-1: ID agenda tidak boleh kosong',
    'items.0.master_agenda_id.exists'   => 'Urutan ke-1: Agenda yang dipilih belum terdaftar.',
    'items.0.start_time.required'       => 'Urutan ke-1: Jam mulai wajib diisi.',
    'items.0.end_time.required'         => 'Urutan ke-1: Jam selesai wajib diisi.',

    'items.*.master_agenda_id'      => 'ID agenda pada baris ini',
    'items.*.start_time'            => 'Jam mulai',
    'items.*.end_time'              => 'Jam selesai',
    'invitations.0.honorific_id.required' => 'Urutan ke-1: ID pejabat undangan tidak boleh kosong.',
    'invitations.0.honorific_id.exists'   => 'Urutan ke-1: Pejabat yang dipilih belum terdaftar.',

    // ============================================
    // CUSTOM ATTRIBUTE NAME
    // ============================================
    'attributes' => [
        'event_name'           => 'Nama Acara',
        'date'                 => 'Tanggal Acara',
        'time_info'            => 'Informasi Waktu',
        'location'             => 'Lokasi / Tempat',
        'pic'                  => 'Pelaksana / Penanggung Jawab',
        'items'                => 'Susunan Acara',
        'invitations'          => 'Daftar Undangan Pejabat',

        // Nested items
        'items.*.master_agenda_id'  => 'Agenda Kegiatan',
        'items.*.start_time'        => 'Jam Mulai',
        'items.*.end_time'          => 'Jam Selesai',

        // Nested invitations
        'invitations.*.honorific_id'=> 'Pejabat Undangan',
    ],
];