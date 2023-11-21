SELECT
  kartoteka.id,
  kartoteka.numer_mieszkania,
  kartoteka.dat AS data,
  kartoteka.op AS opis,
  kartoteka.nal AS naleznosc,
  kartoteka.wpl AS wplata,
  sum(
    (('-1' :: integer * kartoteka.nal) + kartoteka.wpl)
  ) OVER (
    PARTITION BY kartoteka.numer_mieszkania,
    kartoteka.rok
    ORDER BY
      kartoteka.numer_mieszkania,
      kartoteka.dat,
      kartoteka.op
  ) AS saldo
FROM
  (
    SELECT
      naliczenia.id,
      naliczenia.numer_mieszkania,
      naliczenia.data AS dat,
      EXTRACT(
        year
        FROM
          naliczenia.data
      ) AS rok,
      TRIM(
        BOTH
        FROM
          naliczenia.opis
      ) AS op,
      (
        (
          (naliczenia.opal + naliczenia.fundusz) + naliczenia.woda
        ) + naliczenia.smieci
      ) AS nal,
      (0) :: money AS wpl
    FROM
      naliczenia
    UNION
    SELECT
      o.id,
      o.id_firmy AS numer_mieszkania,
      o.data AS dat,
      EXTRACT(
        year
        FROM
          o.data
      ) AS rok,
      (
        (
          (COALESCE(op.opis, o.opis) || ' (' :: text) || TRIM(
            BOTH
            FROM
              o.rodzaj_i_numer_dowodu_ksiegowego
          )
        ) || ')' :: text
      ) AS op,
      (0) :: money AS nal,
      o.kwota AS wpl
    FROM
      (
        operacje o
        LEFT JOIN opisy op ON ((op.id = o.id_opisu))
      )
  ) kartoteka
WHERE
  (
    (kartoteka.numer_mieszkania >= 1)
    AND (kartoteka.numer_mieszkania <= 9)
  )
ORDER BY
  kartoteka.numer_mieszkania,
  kartoteka.dat,
  kartoteka.op;