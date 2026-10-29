# Eval case: mini-case

Test fixture for `engine/test/evals.test.mjs`: the runner end to end with a fake `claude`. The fake ingest seeds the `reply/after-reply` fixture; golden IDs are chosen so the fake judge (matches by equal ID) gives known scores.
