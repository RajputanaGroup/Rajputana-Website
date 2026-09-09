DROP BRAND LOGOS HERE — no code change needed.

Every brand name on the home page (the marquee, the channel switcher and the
portfolio categories) is already an <img> pointing at a file in this folder.
If the file is missing, JavaScript replaces the image with the brand name set
in type, so the page always looks finished.

The moment you add the matching file, the logo appears.

Naming: lowercase, spaces become hyphens, "&" becomes "and", .png preferred
(transparent background, ~120px tall, trimmed of whitespace).

  Cetaphil            -> cetaphil.png
  Sebamed             -> sebamed.png
  L'Oreal             -> loreal.png
  Health & Glow       -> health-and-glow.png
  Johnson & Johnson   -> johnson-and-johnson.png
  DMart               -> dmart.png
  Reliance Retail     -> reliance-retail.png
  Apollo Pharmacy     -> apollo-pharmacy.png
  Swiggy Instamart    -> swiggy-instamart.png

To see the exact filename the page is asking for, open the page in Chrome,
press F12, go to the Network tab and filter by "partner-brands" — every
missing file is listed there by name.
