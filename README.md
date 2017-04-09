OnePass
=========

Introduction
------------

*OnePass* is a bookmarklet to create passwords easily and securely.
With the aid of it, a user can log on different websites with different passwords, while keeping only one master password in mind.

> DECLARATION: OnePass is heavily inspired by [1pass4all](https://github.com/hzheng/1pass4all). Even this README.

The best part is that one compromised password will hardly impact other ones.

Please refer to the [this article](http://en.zhenghui.org/2012/02/21/one-pass-for-all-intro/) for more details.

Difference with 1pass4all
------------

In 1pass4all, the encryption code is not considerate enough.

* It uses sha-256/sha-224 for hashing.
* The BaseX encoding algorithms except base64 drop their outputs to fit with their given charset, which are commented as *lossy* in [1pass4all/hasher.js](https://github.com/hzheng/1pass4all/blob/master/src/hasher.js).
* And its iteration logic in [1pass4all/passCreator.js](https://github.com/hzheng/1pass4all/blob/master/src/passCreator.js) is not well designed, which is widespread criticized by the community in other context.
* Also, the bookmarklet also includes some unnecessary interaction logic and a big **TLD_LIST**, which makes it size too big(~50kb).
* It provides auto-login functionality.


**Instead**,

* OnePass uses a universal algorithm **BaseN** which is created by @KvanTTT in [BaseNcoding](https://github.com/KvanTTT/BaseNcoding) to perform hash result encoding with arbitrary charset.

* It uses [sha3-512](https://en.wikipedia.org/wiki/SHA-3) (source from [jsSHA](https://github.com/Caligatio/jsSHA)) for hashing.

* It uses a simple MVO pattern to implement the interaction logic.

* It uses HTML5 forms feature to simplify the validation logic.

* It uses bootstrap4 for better look of the installation page.

* It does not provide auto-login functionality.


Installation
------------

* Approach 1:

  simply check out the [**installation page**](https://e-cloud.github.io/1pass/dist/install.html)


* Approach 2:

  1. make sure you install node.js and npm/yarn.

  2. install dependencies via npm or yarn.

  3. After `gulp/npm run build`, open the install.html under `/dist` directory, then follow the instructions there.

Usage
-----

One click on the OnePass bookmarklet will prompt out a panel to for generating the password. You should enter the master password and click on the generate button. Then select(auto-selected) and copy the generated password to the form field you need to filled in.

If the user would like the username to be taken into account,
he can enter the username.

More generally, the password syntax is(bracketed terms are optional):

```text
[user ]master_password[ pass_len][ @domain][ *hash_iteration][ +salt]
```

where `master_password`'s length is at least 6,
generated password's length `pass_len` is less than 100,
`hash_iteration` indicates the hash iteration times(0-9999),
`salt` is a [cryptographic salt](http://en.wikipedia.org/wiki/Salt_(cryptography)).


*NOTE:*

* User name and domain are all case-insensitive.
* The domain of the site may be imperfectly extracted(for some cross domain website).

Troubleshooting
---------------

* website complains that the generated password has illegal characters

  Some websites disallow special characters in password. If that is the case, you may try another charset and mark it down somewhere else to check when someday you forget the chosen charset.

* website complains that the generated password is too long

  Currently you may manually truncate the result password.

TODO
--------

* [ ] find a better way the handle bitwise operation on large integer, to remove the BigInteger library and then reduce the code size.

* [ ] figure out a better way to handle incompatible charset for some website.


Feedback
--------

This software has been tested(but not fully) in latest browsers including
Firefox, Chrome, IE, Safari and Opera, and you're welcome to report any bug
or suggestion to [here](https://github.com/e-cloud/1pass/issues).


License
-------

Copyright 2017 e-cloud

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

