#!/usr/bin/env python
# coding: utf-8
# sport-y
# Elizaveta Shashkova
# SPbSU, 2014

import pymongo
import pandas as pd
from os import listdir
from os.path import isfile, join

pd.set_option('display.max_columns', 50)

# type = 1
columns_oid = ['OBJ_NAME', 'EXPL_NAME', 'ADDRESS', 'HOURS', 'EXPL_PHONE', 'EXPL_EMAIL',
               'EXPL_WEB', 'LAT', 'LON']

# type = 2
columns_rownum = ['ObjectShortName', 'SportZoneName', 'Address', 'SportZoneWorkingHours',
                  'HelpPhone', 'Email', 'WebSite', 'SportZoneLatitudeWGS84', 'SportZoneLongitudeWGS84']

# type = 4
columns_name = ['NAME', 'LABEL', 'ADDRESS', 'pass', 'pass', 'pass', 'pass',  'LAT', 'LON']

# type = 3
columns_bike = ['NAME', 'pass', 'WHERE_LOC', 'pass', 'pass', 'pass', 'pass', 'LAT', 'LON']

# The most important columns!
# Names of columns in database + 'category'
columns_res = ['short_name', 'full_name', 'address', 'hours', 'phone', 'email',
               'web', 'lat', 'lon']


def files_in_path(path):
    '''Check all files in path
     Show columns' names and number of lines in .csv file'''
    onlyfiles = [ f for f in listdir(path) if isfile(join(path,f)) ]
    bad_files = 0
    count_files = 0
    count_lines = 0

    for data_file in onlyfiles:
        count_files += 1
        print "--------------File #%d------ %s" % (count_files, path + '/' + data_file)
        print data_file
        try:
            d = pd.read_csv(path + '/' + data_file, sep=';')
            print d.columns
            print len(d)
            count_lines += len(d)
        except:
            bad_files += 1
            print "I can't read this file"

    print "All files: %d" % count_files
    print "Bad files: %d" % bad_files
    print "Objects: %d" % count_lines
    return count_files, bad_files, count_lines


def show_data():
    '''Show info about files in paths'''
    count_files = 0
    bad_files = 0
    count_objects = 0

    mypath = 'data/sport'
    good, bad, count = files_in_path(mypath)

    count_files += good
    bad_files += bad
    count_objects += count

    mypath = 'data/rest'
    good, bad, count = files_in_path(mypath)

    count_files += good
    bad_files += bad
    count_objects += count

    print "========================================"
    print "All files: %d" % count_files
    print "Bad files: %d" % bad_files
    print "Objects: %d" % count_objects
    print "========================================"


def convert_dict(dict_bad, arr_name):
    ''' Convert dict_bad with bad columns names (in arr_name) to database columns names '''
    dict = {}
    for j in range(len(columns_res)):
        if (arr_name[j] not in dict_bad.keys()) and (arr_name[j] != 'pass'):
            print "I haven't column " + arr_name[j]
            #print dict_bad
            break
        if arr_name[j] == 'pass':
            dict[columns_res[j]] = 'null'
        elif dict_bad[arr_name[j]] is 'NaN':
            dict[columns_res[j]] = 'null'
        else:
            dict[columns_res[j]] = dict_bad[arr_name[j]]
    return dict



def add_to_db(path, db_collection):
    ''' Add files from path to database to collection db_collection'''
    only_files = [f for f in listdir(path) if isfile(join(path, f))]
    for data_file in only_files:
        try:
            d = pd.read_csv(path + '/' + data_file, sep=';')
            print data_file
        except:
            print "I can't read this file"
            continue

        cols = d.columns
        type = 0
        if u'WHERE_LOC' in cols:
            type = 3
        elif u'ObjectShortName' in cols:
            type = 2
        elif u'OID' in cols:
            type = 1
        else:
            type = 4
        length = len(d)
        category = data_file.split('.')[0]

        for i in range(length):
            dict_res = {}
            curr_dict = dict(d.iloc[i])
            if type == 1:
                dict_res = convert_dict(curr_dict, columns_oid)
            elif type == 2:
                dict_res = convert_dict(curr_dict, columns_rownum)
            elif type == 3:
                dict_res = convert_dict(curr_dict, columns_bike)
            elif type == 4:
                dict_res = convert_dict(curr_dict, columns_name)
            dict_res['category'] = category
            db_collection.save(dict_res)



def show_short(path, name):
    '''Show short info about .csv file'''
    d = pd.read_csv(path + '/' + name, sep=';')
    print d[0:5]


if __name__ == '__main__':
#   show_data()
    conn = pymongo.Connection()
    db = conn['sporty-db']
    checkpoints = db['checkpoints']

    add_to_db('data/sport', checkpoints)
    add_to_db('data/rest', checkpoints)



