<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'name',
    ];

    public function contestants()
    {
        return $this->hasMany(Contestant::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
}
