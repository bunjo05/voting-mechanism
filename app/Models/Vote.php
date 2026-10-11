<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'voter_id',
        'position_id',
        'contestant_id',
    ];

    public function voter()
    {
        return $this->belongsTo(Voter::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function contestant()
    {
        return $this->belongsTo(Contestant::class);
    }
}
