<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voter extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'passport_number',
        'ip_address',
    ];

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
