<?php

namespace Domains\Auth\Enums;

enum RoleType: string
{
    case Admin = 'admin';
    case Member = 'member';
}