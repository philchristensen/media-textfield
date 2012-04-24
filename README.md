media-textfield
===============

A textfield that auto-generates previews from pasted URLs.

Or at least that was the plan. It's not currently possible to do this without an
external service of some kind, since there's no way to lift the same-origin policy.

Instead this is just a field that scans for URLs in it, and appends them to another container.